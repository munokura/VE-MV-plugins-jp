/*
 * ==============================================================================
 * ** Victor Engine MV - Action Strengthen
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.11.28 > First release.
 *  v 1.01 - 2015.11.29 > Added flat addition and code for strengthen values.
 *  v 1.02 - 2015.11.30 > Fixed issues with plugins using meta tags.
 *  v 1.03 - 2015.12.07 > Fixed issues with weapon element strengthen.
 *  v 1.04 - 2015.12.21 > Compatibility with Basic Module 1.04.
 *  v 1.05 - 2016.03.03 > Improved code for better handling script codes.
 *  v 1.06 - 2020.05.17 > fix by ze1.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Action Strengthen'] = '1.06';

var VictorEngine = VictorEngine || {};
VictorEngine.ActionStrengthen = VictorEngine.ActionStrengthen || {};

(function () {

	VictorEngine.ActionStrengthen.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.ActionStrengthen.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Action Strengthen', 'VE - Basic Module', '1.04');
	};

	VictorEngine.ActionStrengthen.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.ActionStrengthen.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.06 - Increase the power of specific actions.
 * @author Victor Sant
 *
 * @help 
 * ------------------------------------------------------------------------------
 * This plugin have effect only the damage or healing caused by the action.
 * It have no effect on actions that doesn't heal or deal damage.
 * ------------------------------------------------------------------------------
 * Actors, Classes, Enemies, Weapons, Armors and States Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <skill strengthen: x, y>
 *  <skill strengthen: x, y%>
 *   Change the power of a skill.
 *     x : ID of the skill.
 *     y : value changed. (can be negative and/or a % value)
 *
 * ---------------
 *
 *  <item strengthen: x, y>
 *  <item strengthen: x, y%>
 *   Change the power of an item.
 *     x : ID of the item.
 *     y : value changed. (can be negative and/or a % value)
 *
 *  <element strengthen: x, y>
 *  <element strengthen: x, y%>
 *   Change the power of actions with an element.
 *     x : ID of the element.
 *     y : value changed. (can be negative and/or a % value)
 *
 * ---------------
 *
 *  <state strengthen: x, y>
 *  <state strengthen: x, y%>
 *   Change the power of actions that changes a state.
 *     x : ID of the state.
 *     y : value changed. (can be negative and/or a % value)
 *
 * ---------------
 *
 *  <stype strengthen: x, y>
 *  <stype strengthen: x, y%>
 *   Change the power of skills with a specific Skill Type.
 *     x : ID of the skill type.
 *     y : value changed. (can be negative and/or a % value)
 *
 * ---------------
 *
 *  <itype strengthen: x, y>
 *  <itype strengthen: x, y%>
 *   Change the power of the items with a specific Item Type.
 *     x : ID of the item type.
 *     y : value changed. (can be negative and/or a % value)
 *
 * ---------------
 *
 *  <custom skill strengthen: x>
 *   result = code
 *  </custom skill strengthen>
 *   Process a script code to change the power of a skill.
 *     x    : ID of the skill.
 *     code : code that will return the changed value.
 *
 * ---------------
 *
 *  <custom item strengthen: x>
 *   result = code
 *  </custom item strengthen>
 *   Process a script code to change the power of an item.
 *     x    : ID of the item.
 *     code : code that will return the changed value.
 *
 * ---------------
 *
 *  <custom element strengthen: x>
 *   result = code
 *  </custom element strengthen>
 *   Process a script code to change the power of actions with an element.
 *     x    : ID of the element.
 *     code : code that will return the changed value.
 *
 * ---------------
 *
 *  <custom state strengthen: x>
 *   result = code
 *  </custom state strengthen>
 *   Process a script code to change the power of actions that changes a state.
 *     x    : ID of the state.
 *     code : code that will return the changed value.
 *
 * ---------------
 *
 *  <custom stype strengthen: x>
 *   result = code
 *  </custom stype strengthen>
 *   Process a script code to change the power of skills with a specific Skill Type.
 *     x    : ID of the skill type.
 *     code : code that will return the changed value.
 *
 * ---------------
 *
 *  <custom itype strengthen: x>
 *   result = code
 *  </custom itype strengthen>
 *   Process a script code to change the power of the items with a specific Item Type.
 *     x    : ID of the item type.
 *     code : code that will return the changed value.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "b" for the target, "v[x]" for variable and "item" for the item
 *  object. The 'result' must return a numeric value.
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *   <skill strengthen: 4, +200>
 *
 * ---------------
 *
 *   <item strengthen: 5, -25%>
 *
 * ---------------
 *
 *   <custom element strengthen: 6>
 *    result = a.atk * 10;
 *   </custom element strengthen>
 *
 * ---------------
 *
 *   <custom stype strengthen: 1>
 *    result = Math.max(a.atk - b.def, 0) * v[5];
 *   </custom stype strengthen>
 *
 */
/*:ja
 * @plugindesc v1.06 アクションの威力を変更できます
 * @author Victor Sant
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/action-strengthen/
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
 * アクションによって引き起こされたダメージや回復にのみ効果があります。
 * 回復やダメージを与えないアクションには効果がありません。
 * ---------------------------------------------------------------------------
 * アクター、職業、敵キャラ、武器、防具、ステートのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <skill strengthen: x, y>
 *  <skill strengthen: x, y%>
 *   スキルの威力を変更します。
 *     x : スキルID
 *     y : 変更値 (正負の値 / %値)
 *
 * ---------------
 *
 *  <item strengthen: x, y>
 *  <item strengthen: x, y%>
 *   アイテムの威力を変更します。
 *     x : アイテムID
 *     y : 変更値 (正負の値 / %値)
 *
 *  <element strengthen: x, y>
 *  <element strengthen: x, y%>
 *   属性の威力を変更します。
 *     x : 属性ID
 *     y : 変更値 (正負の値 / %値)
 *
 * ---------------
 *
 *  <state strengthen: x, y>
 *  <state strengthen: x, y%>
 *   ステートの威力を変更します。
 *     x : ステートID
 *     y : 変更値 (正負の値 / %値)
 *
 * ---------------
 *
 *  <stype strengthen: x, y>
 *  <stype strengthen: x, y%>
 *   スキルタイプの威力を変更します。
 *     x : スキルタイプID
 *     y : 変更値 (正負の値 / %値)
 *
 * ---------------
 *
 *  <itype strengthen: x, y>
 *  <itype strengthen: x, y%>
 *   アイテムタイプの威力を変更します。
 *     x : アイテムタイプID
 *     y : 変更値 (正負の値 / %値)
 *
 * ---------------
 *
 *  <custom skill strengthen: x>
 *   result = code
 *  </custom skill strengthen>
 *   スキルの威力をコードの結果で変更します。
 *     x    : スキルID
 *     code : 変更値を返すコード
 *
 * ---------------
 *
 *  <custom item strengthen: x>
 *   result = code
 *  </custom item strengthen>
 *   アイテムの威力をコードの結果で変更します。
 *     x    : アイテムID
 *     code : 変更値を返すコード
 *
 * ---------------
 *
 *  <custom element strengthen: x>
 *   result = code
 *  </custom element strengthen>
 *   属性の威力をコードの結果で変更します。
 *     x    : 属性ID
 *     code : 変更値を返すコード
 *
 * ---------------
 *
 *  <custom state strengthen: x>
 *   result = code
 *  </custom state strengthen>
 *   ステートの威力をコードの結果で変更します。
 *     x    : ステートID
 *     code : 変更値を返すコード
 *
 * ---------------
 *
 *  <custom stype strengthen: x>
 *   result = code
 *  </custom stype strengthen>
 *   スキルタイプの威力をコードの結果で変更します。
 *     x    : スキルタイプID
 *     code : 変更値を返すコード
 *
 * ---------------
 *
 *  <custom itype strengthen: x>
 *   result = code
 *  </custom itype strengthen>
 *   アイテムタイプの威力をコードの結果で変更します。
 *     x    : アイテムタイプID
 *     code : 変更値を返すコード
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 * コードではダメージ式と同じ値を使っているので、使用者には'a'、対象には'b'、
 * 変数には'v[x]'、アイテムオブジェクトには'item'を使います。
 * 結果'は数値を返す必要があります。
 *
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 *   <skill strengthen: 4, +200>
 *
 * ---------------
 *
 *   <item strengthen: 5, -25%>
 *
 * ---------------
 *
 *   <custom element strengthen: 6>
 *    result = a.atk * 10;
 *   </custom element strengthen>
 *
 * ---------------
 *
 *   <custom stype strengthen: 1>
 *    result = Math.max(a.atk - b.def, 0) * v[5];
 *   </custom stype strengthen>
 *
 */

(function () {

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.ActionStrengthen.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.ActionStrengthen.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'enemy', 'weapon', 'armor', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.ActionStrengthen.loadNotes(data);
	};

	VictorEngine.ActionStrengthen.loadNotes = function (data) {
		data.actionStrengthen = data.actionStrengthen || {}
		data.actionStrengthen.item = data.actionStrengthen.item || {};
		data.actionStrengthen.skill = data.actionStrengthen.skill || {};
		data.actionStrengthen.itype = data.actionStrengthen.itype || {};
		data.actionStrengthen.stype = data.actionStrengthen.stype || {};
		data.actionStrengthen.state = data.actionStrengthen.state || {};
		data.actionStrengthen.element = data.actionStrengthen.element || {};
		this.processNotes(data, "item");
		this.processNotes(data, "skill");
		this.processNotes(data, "itype");
		this.processNotes(data, "stype");
		this.processNotes(data, "state");
		this.processNotes(data, "element");
	};

	VictorEngine.ActionStrengthen.processNotes = function (data, type) {
		var code = type + ' strengthen';
		var regex1 = new RegExp('<' + code + '[ ]*:[ ]*(\\d+),[ ]*([+-]?\\d+)(\\%)?[ ]*>', 'gi');
		var regex2 = VictorEngine.getNotesValues('custom ' + code + '[ ]*: (\\d+)', 'custom ' + code);
		while ((match = regex1.exec(data.note)) !== null) {
			this.processValues(match, data.actionStrengthen[type]);
		};
		while ((match = regex2.exec(data.note)) !== null) {
			this.processValues(match, data.actionStrengthen[type], true);
		};
	};

	VictorEngine.ActionStrengthen.processValues = function (match, data, code) {
		var result = {};
		result.rate = !code && match[3] ? Number(match[2]) || 0 : 0;
		result.flat = !code && !match[3] ? Number(match[2]) || 0 : 0;
		result.code = code ? String(match[2]).trim() : '';
		data[match[1]] = result;
	};

	//=============================================================================
	// Game_Action
	//=============================================================================

	VictorEngine.ActionStrengthen.evalDamageFormula = Game_Action.prototype.evalDamageFormula;
	Game_Action.prototype.evalDamageFormula = function (target) {
		var result = VictorEngine.ActionStrengthen.evalDamageFormula.call(this, target);
		return this.actionStrengthenValue(result, this.isSkill(), this.item(), target);
	};

	VictorEngine.ActionStrengthen.itemEffectRecoverHp = Game_Action.prototype.itemEffectRecoverHp;
	Game_Action.prototype.itemEffectRecoverHp = function (target, effect) {
		var newEffect = this.itemEffectStrengthen(target, effect);
		VictorEngine.ActionStrengthen.itemEffectRecoverHp.call(this, target, newEffect);
	};

	VictorEngine.ActionStrengthen.itemEffectRecoverMp = Game_Action.prototype.itemEffectRecoverMp;
	Game_Action.prototype.itemEffectRecoverMp = function (target, effect) {
		var newEffect = this.itemEffectStrengthen(target, effect);
		VictorEngine.ActionStrengthen.itemEffectRecoverMp.call(this, target, newEffect);
	};

	VictorEngine.ActionStrengthen.itemEffectGainTp = Game_Action.prototype.itemEffectGainTp;
	Game_Action.prototype.itemEffectGainTp = function (target, effect) {
		var newEffect = this.itemEffectStrengthen(target, effect);
		VictorEngine.ActionStrengthen.itemEffectGainTp.call(this, target, newEffect);
	};

	Game_Action.prototype.actionStrengthenValue = function (result, isSkill, item, target) {
		var sign = result > 0;
		var value = this.getActionStrengthenValues(isSkill, item, target);
		result += this.getActionStrengthenCode(value, target);
		result += this.getActionStrengthenFlat(value);
		result *= this.getActionStrengthenRate(value);
		if (sign) { return Math.max(result, 0) } else { return Math.min(result, 0) };
	};

	Game_Action.prototype.actionStrengthenValueRate = function (result, isSkill, item, target) {
		var value = this.getActionStrengthenValues(isSkill, item, target);
		return result * this.getActionStrengthenRate(value);
	};

	Game_Action.prototype.getActionStrengthenRate = function (value) {
		var result = value.reduce(function (r, data) { return r + (data.rate || 0) }, 0);
		return Math.max(1.0 + result / 100, 0);
	};

	Game_Action.prototype.getActionStrengthenFlat = function (value) {
		return value.reduce(function (r, data) { return r + (data.flat || 0) }, 0);
	};

	Game_Action.prototype.getActionStrengthenCode = function (value, target) {
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

	Game_Action.prototype.getActionStrengthenValues = function (isSkill, item, target) {
		var object = this;
		var subject = this.subject();
		return subject.traitObjects().reduce(function (r, data) {
			var value = object.getActionStrengthenData(subject, data.actionStrengthen, isSkill, item);
			return r.concat(value);
		}, []);
	};

	Game_Action.prototype.getActionStrengthenData = function (subject, data, isSkill, item) {
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
		// var elmtnValue = VictorEngine.getAllElements(subject, item).reduce(function (r, elementId) {
		var elmtnValue = VictorEngine.getAllElements(subject, this).reduce(function (r, elementId) {
			value = data.element[elementId] || {};
			return r.concat(value);
		}, []);
		return result.concat(itemValue, typeValue, stateValue, elmtnValue);
	};

	Game_Action.prototype.itemEffectStrengthen = function (target, effect) {
		var newEffect = {};
		newEffect.code = effect.code;
		newEffect.dataId = effect.dataId;
		newEffect.value1 = this.actionStrengthenValueRate(effect.value1, this.isSkill(), this.item(), target);
		newEffect.value2 = this.actionStrengthenValue(effect.value2, this.isSkill(), this.item(), target);
		return newEffect
	};

})(); 
