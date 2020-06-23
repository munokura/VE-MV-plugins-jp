/*
 * ==============================================================================
 * ** Victor Engine MV - Action Resistance
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.11.30 > First release.
 *  v 1.01 - 2015.12.07 > Fixed issues with weapon element resistance.
 *  v 1.02 - 2015.12.21 > Compatibility with Basic Module 1.04.
 *  v 1.03 - 2016.03.04 > Improved code for better handling script codes.
 *  v 1.04 - 2020.06.22 > fix by munokura.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Action Resistance'] = '1.03';

var VictorEngine = VictorEngine || {};
VictorEngine.ActionResistance = VictorEngine.ActionResistance || {};

(function () {

	VictorEngine.ActionResistance.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.ActionResistance.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Action Resistance', 'VE - Basic Module', '1.04');
	};

	VictorEngine.ActionResistance.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.ActionResistance.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.03 - Reduce the damage taken by specific actions.
 * @author Victor Sant
 *
 * @param Invert Damage
 * @desc If the total damage or healing is negative, it will have.
 * the oppositte effect.	true - ON	false - OFF
 * @default false
 *
 * @help 
 * ------------------------------------------------------------------------------
 * This plugin have effect only the damage or healing caused by the action.
 * It have no effect on actions that doesn't heal or deal damage.
 * ------------------------------------------------------------------------------
 * Actors, Classes, Enemies, Weapons, Armors and States Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <skill resistance: x, y>
 *  <skill resistance: x, y%>
 *   Reduce the power of a skill.
 *     x : ID of the skill.
 *     y : value changed. (can be negative and/or a % value)
 *  
 * ---------------
 *
 *  <item resistance: x, y>
 *  <item resistance: x, y%>
 *   Reduce the power of an item.
 *     x : ID of the item.
 *     y : value changed. (can be negative and/or a % value)
 *  
 * ---------------
 *
 *  <element resistance: x, y>
 *  <element resistance: x, y%>
 *   Reduce the power of actions with an element.
 *     x : ID of the element.
 *     y : value changed. (can be negative and/or a % value)
 *  
 * ---------------
 *
 *  <state resistance: x, y>
 *  <state resistance: x, y%>
 *   Reduce the power of actions that changes a state.
 *     x : ID of the state.
 *     y : value changed. (can be negative and/or a % value)
 *  
 * ---------------
 *
 *  <stype resistance: x, y>
 *  <stype resistance: x, y%>
 *   Reduce the power of skills with a specific Skill Type.
 *     x : ID of the skill type.
 *     y : value changed. (can be negative and/or a % value)
 *  
 * ---------------
 *
 *  <itype resistance: x, y>
 *  <itype resistance: x, y%>
 *   Reduce the power of the items with a specific Item Type.
 *     x : ID of the item type.
 *     y : value changed. (can be negative and/or a % value)
 *  
 * ---------------
 *
 *  <custom skill resistance: x>
 *   code
 *  </custom skill resistance>
 *   Process a script code to reduce the power of a skill.
 *     x    : ID of the skill.
 *     code : code that will return the reduction value.
 *  
 * ---------------
 *
 *  <custom item resistance: x>
 *   result = code
 *  </custom item resistance>
 *   Process a script code to reduce the power of an item.
 *     x    : ID of the item.
 *     code : code that will return the reduction value.
 *  
 * ---------------
 *
 *  <custom element resistance: x>
 *   result = code
 *  </custom element resistance>
 *   Process a script code to reduce the power of actions with an element.
 *     x    : ID of the element.
 *     code : code that will return the reduction value.
 *  
 * ---------------
 *
 *  <custom state resistance: x>
 *   result = code
 *  </custom state resistance>
 *   Process a script code to reduce the power of actions that changes a state.
 *     x    : ID of the state.
 *     code : code that will return the reduction value.
 *  
 * ---------------
 *
 *  <custom stype resistance: x>
 *   result = code
 *  </custom stype resistance>
 *   Process a script code to reduce the power of skills with a specific Skill Type.
 *     x    : ID of the skill type.
 *     code : code that will return the reduction value.
 *  
 * ---------------
 *
 *  <custom itype resistance: x>
 *   result = code
 *  </custom itype resistance>
 *   Process a script code to reduce the power of the items with a specific Item Type.
 *     x    : ID of the item type.
 *     code : code that will return the reduction value.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "b" for the target, "v[x]" for variable and "item" for the item
 *  object. The 'result' must return a numeric value.
 *  
 * ---------------
 *
 *  The main difference between this plugin and the 'Action Strengthen' is that
 *  this one looks at the target, while the Action Strengthen looks at the user.
 *  
 * ---------------
 *
 *  Setting elemental resistance by a % value is different from setting them on
 *  on the database. This setting is applied before the resistance, so it will
 *  not be additive.
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *   <skill resistance: 4, +200>
 * 
 * ---------------
 *
 *   <item resistance: 5, -25%>
 *  
 * ---------------
 *
 *   <custom element resistance: 6>
 *    result = b.def * 10;
 *   </custom element resistance>
 *  
 * ---------------
 *
 *   <custom stype resistance: 1>
 *    result = Math.max(b.def - a.atk, 0) * v[5];
 *   </custom stype resistance>
 *
 */
/*:ja
 * @plugindesc v1.03 - 特定のアクションからダメージを削減する効果を作成できます
 * @author Victor Sant
 * 
 * @param Invert Damage
 * @text ダメージ反転
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc 合計ダメージや回復がマイナスの場合、逆効果にします
 * 有効:true / 無効:false
 * @default false
 * 
 * @help 
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 * 
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/action-resistance/
 * 
 * 
 * ===========================================================================
 * 必要プラグイン
 * ===========================================================================
 * 
 * このプラグインを使用するには、下記のプラグインが必要です。
 * - VE_BasicModule
 * 
 * 
 * ---------------------------------------------------------------------------
 * このプラグインは、
 * アクションによって引き起こされたダメージや回復にのみ効果があります。
 * 回復やダメージを与えないアクションには効果がありません。
 * ---------------------------------------------------------------------------
 * アクター、職業、敵キャラ、武器、防具、ステートのメモタグ
 * ---------------------------------------------------------------------------
 * 
 *  <skill resistance: x, y>
 *  <skill resistance: x, y%>
 *   スキルの威力を下げる
 *     x : スキルID
 *     y : 変更値。(正負の値か%値)
 *  
 * ---------------
 * 
 *  <item resistance: x, y>
 *  <item resistance: x, y%>
 *   アイテムの威力を下げる。
 *     x : アイテムID
 *     y : 変更値。(正負の値か%値)
 *  
 * ---------------
 * 
 *  <element resistance: x, y>
 *  <element resistance: x, y%>
 *   属性の威力を下げる。
 *     x : 属性ID
 *     y : 変更値。(正負の値か%値)
 *  
 * ---------------
 * 
 *  <state resistance: x, y>
 *  <state resistance: x, y%>
 *   ステートを変える確率を下げる。
 *     x : ステートID
 *     y : 変更値。(正負の値か%値)
 *  
 * ---------------
 * 
 *  <stype resistance: x, y>
 *  <stype resistance: x, y%>
 *   特定スキルタイプのスキルの威力を下げる。
 *     x : スキルタイプID
 *     y : 変更値。(正負の値か%値)
 *  
 * ---------------
 * 
 *  <itype resistance: x, y>
 *  <itype resistance: x, y%>
 *   特定アイテムタイプのアイテムの威力を下げる。
 *     x : アイテムタイプID
 *     y : 変更値。(正負の値か%値)
 *  
 * ---------------
 * 
 *  <custom skill resistance: x>
 *   code
 *  </custom skill resistance>
 *   スクリプトコードを処理してスキルの威力を下げる。
 *     x    : スキルID
 *     code : 変更値を返すコード
 *  
 * ---------------
 * 
 *  <custom item resistance: x>
 *   result = code
 *  </custom item resistance>
 *   スクリプトコードを処理してアイテムの威力を下げる。
 *     x    : アイテムID
 *     code : 変更値を返すコード
 *  
 * ---------------
 * 
 *  <custom element resistance: x>
 *   result = code
 *  </custom element resistance>
 *   スクリプトコードを処理して属性の威力を下げる。
 *     x    : 属性ID
 *     code : 変更値を返すコード
 *  
 * ---------------
 * 
 *  <custom state resistance: x>
 *   result = code
 *  </custom state resistance>
 *   スクリプトコードを処理して、ステートを変化させる確率を下げる。
 *     x    : ステートID
 *     code : 変更値を返すコード
 *  
 * ---------------
 * 
 *  <custom stype resistance: x>
 *   result = code
 *  </custom stype resistance>
 *   スクリプトコードを処理して特定スキルタイプのスキルの威力を下げる。
 *     x    : スキルタイプID
 *     code : 変更値を返すコード
 *  
 * ---------------
 * 
 *  <custom itype resistance: x>
 *   result = code
 *  </custom itype resistance>
 *   スクリプトコードを処理して特定アイテムタイプのアイテムの威力を下げる。
 *     x    : アイテムタイプID
 *     code : 変更値を返すコード
 * 
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 * 
 * コードではダメージ式と同じ値を使っているので、使用者には'a'、対象には'b'、
 * 変数には'v[x]'、アイテムオブジェクトには'item'を使います。
 * 'result'は数値を返す必要があります。
 *  
 * ---------------
 * 
 * このプラグインと'Action Strengthen'の大きな違いは、
 * このプラグインは対象を見ているのに対し、
 * 'Action Strengthen'は使用者を見ていることです。
 * 
 * ---------------
 * 
 * 属性耐性を%値で設定するのと、データベース上で設定するのとは異なります。
 * この設定は耐性値の前に適用されるので、加算されることはありません。
 * 
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 * 
 *   <skill resistance: 4, +200>
 * 
 * ---------------
 * 
 *   <item resistance: 5, -25%>
 *  
 * ---------------
 * 
 *   <custom element resistance: 6>
 *    result = b.def * 10;
 *   </custom element resistance>
 *  
 * ---------------
 * 
 *   <custom stype resistance: 1>
 *    result = Math.max(b.def - a.atk, 0) * v[5];
 *   </custom stype resistance>
 * 
 */

(function () {

	//=============================================================================
	// Parameters
	//=============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.ActionResistance = {};
		VictorEngine.Parameters.ActionResistance.Invert = eval(parameters["Invert Damage"]);
	};
	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.ActionResistance.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.ActionResistance.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'enemy', 'weapon', 'armor', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.ActionResistance.loadNotes(data);
	};

	VictorEngine.ActionResistance.loadNotes = function (data) {
		data.actionResistance = data.actionResistance || {}
		data.actionResistance.item = data.actionResistance.item || {};
		data.actionResistance.skill = data.actionResistance.skill || {};
		data.actionResistance.itype = data.actionResistance.itype || {};
		data.actionResistance.stype = data.actionResistance.stype || {};
		data.actionResistance.state = data.actionResistance.state || {};
		data.actionResistance.element = data.actionResistance.element || {};
		this.processNotes(data, "item");
		this.processNotes(data, "skill");
		this.processNotes(data, "itype");
		this.processNotes(data, "stype");
		this.processNotes(data, "state");
		this.processNotes(data, "element");
	};

	VictorEngine.ActionResistance.processNotes = function (data, type) {
		var match;
		var code = type + ' resistance';
		var regex1 = new RegExp('<' + code + '[ ]*:[ ]*(\\d+),[ ]*([+-]?\\d+)(\\%)?[ ]*>', 'gi');
		var regex2 = VictorEngine.getNotesValues('custom ' + code + '[ ]*: (\\d+)', 'custom ' + code);
		while ((match = regex1.exec(data.note)) !== null) { this.processValues(data, match, type, false) };
		while ((match = regex2.exec(data.note)) !== null) { this.processValues(data, match, type, true) };
	};

	VictorEngine.ActionResistance.processValues = function (data, match, type, code) {
		var result = {};
		result.rate = !code && match[3] ? Number(match[2]) || 0 : 0;
		result.flat = !code && !match[3] ? Number(match[2]) || 0 : 0;
		result.code = code ? String(match[2]).trim() : '';
		data.actionResistance[type][match[1]] = result;
	};

	//=============================================================================
	// Game_Action
	//=============================================================================

	VictorEngine.ActionResistance.evalDamageFormula = Game_Action.prototype.evalDamageFormula;
	Game_Action.prototype.evalDamageFormula = function (target) {
		var result = VictorEngine.ActionResistance.evalDamageFormula.call(this, target);
		return this.actionResistanceValue(result, this.isSkill(), this.item(), target);
	};

	VictorEngine.ActionResistance.itemEffectRecoverHp = Game_Action.prototype.itemEffectRecoverHp;
	Game_Action.prototype.itemEffectRecoverHp = function (target, effect) {
		var newEffect = this.itemEffectResistance(target, effect);
		VictorEngine.ActionResistance.itemEffectRecoverHp.call(this, target, newEffect);
	};

	VictorEngine.ActionResistance.itemEffectRecoverMp = Game_Action.prototype.itemEffectRecoverMp;
	Game_Action.prototype.itemEffectRecoverMp = function (target, effect) {
		var newEffect = this.itemEffectResistance(target, effect);
		VictorEngine.ActionResistance.itemEffectRecoverMp.call(this, target, newEffect);
	};

	VictorEngine.ActionResistance.itemEffectGainTp = Game_Action.prototype.itemEffectGainTp;
	Game_Action.prototype.itemEffectGainTp = function (target, effect) {
		var newEffect = this.itemEffectResistance(target, effect);
		VictorEngine.ActionResistance.itemEffectGainTp.call(this, target, newEffect);
	};

	Game_Action.prototype.actionResistanceValue = function (result, isSkill, item, target) {
		var sign = result > 0;
		var value = this.getActionResistanceValues(isSkill, item, target);
		result -= this.getActionResistanceCode(value, target);
		result -= this.getActionResistanceFlat(value);
		result *= this.getActionResistanceRate(value);
		if (VictorEngine.Parameters.ActionResistance.Invert) {
			return result;
		} else {
			if (sign) { return Math.max(result, 0) } else { return Math.min(result, 0) };
		}
	};

	Game_Action.prototype.actionResistanceValueRate = function (result, isSkill, item, target) {
		var value = this.getActionResistanceValues(isSkill, item, target);
		return result * this.getActionResistanceRate(value);
	};

	Game_Action.prototype.getActionResistanceRate = function (value) {
		var result = value.reduce(function (r, data) { return r + (data.rate || 0) }, 0);
		if (VictorEngine.Parameters.ActionResistance.Invert) {
			return 1.0 - result / 100;
		} else {
			return Math.max(1.0 - result / 100, 0)
		}
	};

	Game_Action.prototype.getActionResistanceFlat = function (value) {
		return value.reduce(function (r, data) { return r + (data.flat || 0) }, 0);
	};

	Game_Action.prototype.getActionResistanceCode = function (value, target) {
		var result = 0;
		var item = this.item();
		var a = this.subject();
		var b = target;
		var v = $gameVariables._data;
		return value.reduce(function (r, data) {
			try {
				eval(data.code)
				return r + (Number(result) || 0);
			} catch (e) {
				return r;
			}
		}, 0);
	};

	Game_Action.prototype.getActionResistanceValues = function (isSkill, item, target) {
		var object = this;
		var subject = this.subject();
		return target.traitObjects().reduce(function (r, data) {
			var value = object.getActionResistanceData(subject, data.actionResistance, isSkill, item);
			return r.concat(value);
		}, []);
	};

	Game_Action.prototype.getActionResistanceData = function (subject, data, isSkill, item) {
		var value;
		var result = [];
		if (isSkill) {
			var itemValue = data.skill[item.id] || {};
			var typeValue = data.stype[item.stypeId] || {};
		} else {
			var itemValue = data.item[item.id] || {};
			var typeValue = data.itype[item.itypeId] || {};
		};
		var stateValue = VictorEngine.getAllStates(subject, item).reduce(function (r, stateId) {
			value = data.state[stateId] || {};
			return r.concat(value);
		}, []);
		var elmtnValue = VictorEngine.getAllElements(subject, this).reduce(function (r, elementId) {
			// var elmtnValue = VictorEngine.getAllElements(subject, item).reduce(function(r, elementId) {	//munokura
			value = data.element[elementId] || {};
			return r.concat(value);
		}, []);
		return result.concat(itemValue, typeValue, stateValue, elmtnValue);
	};

	Game_Action.prototype.itemEffectResistance = function (target, effect) {
		var newEffect = {};
		newEffect.code = effect.code;
		newEffect.dataId = effect.dataId;
		newEffect.value1 = this.actionResistanceValueRate(effect.value1, this.isSkill(), this.item(), target);
		newEffect.value2 = this.actionResistanceValue(effect.value2, this.isSkill(), this.item(), target);
		return newEffect
	};

})(); 
