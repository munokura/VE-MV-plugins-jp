/*
 * ==============================================================================
 * ** Victor Engine MV - Action States
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.12.08 > First release.
 *  v 1.01 - 2015.12.14 > Fixed issue with <action state> tag.
 *  v 1.02 - 2015.12.21 > Compatibility with Basic Module 1.04.
 *  v 1.03 - 2016.03.03 > Improved code for better handling script codes.
 *                      > Fixed issue with rates not being set properly.
 *  v 1.04 - 2020.05.17 > fix by ze1.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Action States'] = '1.04';

var VictorEngine = VictorEngine || {};
VictorEngine.ActionStates = VictorEngine.ActionStates || {};

(function () {

	VictorEngine.ActionStates.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.ActionStates.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Action States', 'VE - Basic Module', '1.04');
	};

	VictorEngine.ActionStates.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.ActionStates.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.04 - Change the target states when hit with a specific action.
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
 *  <skill state: x, type id>
 *  <skill state: x, type id[, y%]>
 *   Change the state of battler when hit by a skill.
 *     x    : ID of the skill.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     y    : chance (opitional, 100% if not set)
 * 
 * ---------------
 *
 *  <item state: x, type id>
 *  <item state: x, type id[, y%]>
 *   Change the state of battler when hit by an item.
 *     x    : ID of the item.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     y    : chance (opitional, 100% if not set)
 *
 * ---------------
 *
 *  <element state: x, type id>
 *  <element state: x, type id[, y%]>
 *   Change the state of battler when hit by an element.
 *     x    : ID of the element.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     y    : chance (opitional, 100% if not set)
 *
 * ---------------
 *
 *  <action state: x, type id>
 *  <action state: x, type id[, y%]>
 *   Change the state of battler when hit by actions that changes states.
 *     x    : ID of the state of the action.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     y    : chance (opitional, 100% if not set)
 *
 * ---------------
 *
 *  <stype state: x, type id>
 *  <stype state: x, type id[, y%]>
 *   Change the state of battler when hit by skills with a specif Skill Type.
 *     x    : ID of the skill type.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     y    : chance (opitional, 100% if not set)
 *
 * ---------------
 *
 *  <itype state: x, type id>
 *  <itype state: x, type id[, y%]>
 *   Change the state of battler when hit by items with a specif Item Type.
 *     x    : ID of the item type.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     y    : chance (opitional, 100% if not set)
 *
 * ---------------
 *
 *  <custom skill state: x, type id>
 *   result = code
 *  </custom skill state>
 *   Process a script code to change the state of battler when hit by a skill.
 *     x    : ID of the skill.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     code : code that will return the success chance.
 *
 * ---------------
 *
 *  <custom item state: x, type id>
 *   result = code
 *  </custom item state>
 *   Process a script code to change the state of battler when hit by an item.
 *     x    : ID of the item.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     code : code that will return the success chance.
 *
 * ---------------
 *
 *  <custom element state: x, type id>
 *   result = code
 *  </custom element state>
 *   Process a script code to change the state of battler when hit by an element.
 *     x    : ID of the element.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     code : code that will return the success chance.
 *
 * ---------------
 *
 *  <custom action state: x, type id>
 *   result = code
 *  </custom action state>
 *   Process a script code to change the state of battler when hit by actions
 *   that changes states.
 *     x    : ID of the state of the action.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     code : code that will return the success chance.
 *
 * ---------------
 *
 *  <custom stype state: x, type id>
 *   result = code
 *  </custom stype state>
 *   Process a script code to change the state of battler when hit by skills
 *   with a specif Skill Type.
 *     x    : ID of the skill type.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     code : code that will return the success chance.
 *
 * ---------------
 *
 *  <custom itype state: x, type id>
 *   result = code
 *  </custom itype state>
 *   Process a script code to change the state of battler when hit by items
 *   with a specif Item Type.
 *     x    : ID of the item type.
 *     type : type of change. (add/remove)
 *     id   : ID of the state.
 *     code : code that will return the success chance.
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
 *  States resistances are still valid, so even an 100% rate will not ensure
 *  that the state is applied if the target is resistant to that state or have
 *  high Luck.
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *   <skill state: 4, add 5>
 *
 * ---------------
 *
 *   <item state: 5, remove 3>
 *
 * ---------------
 *
 *   <element state: 6, add 7, 50%>
 *
 * ---------------
 *
 *   <custom stype state: 1, add 4>
 *    result = 10 * a.luk / b.luk;
 *   </custom stype state>
 *
 */
/*:ja
 * @plugindesc v1.04 アクションでのダメージや回復でステートを付加・解除できます
 * @author Victor Sant
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/action-states/
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
 *
 * ---------------------------------------------------------------------------
 * アクター、職業、敵キャラ、武器、防具、ステートのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <skill state: x, type id>
 *  <skill state: x, type id[, y%]>
 *   スキル命中時にバトラーのステートを変更します。
 *     x    : スキルID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     y    : 確率 (任意設定。省略時は100)
 *
 * ---------------
 *
 *  <item state: x, type id>
 *  <item state: x, type id[, y%]>
 *   アイテム命中時にバトラーのステートを変更します。
 *     x    : アイテムID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     y    : 確率 (任意設定。省略時は100)
 *
 * ---------------
 *
 *  <element state: x, type id>
 *  <element state: x, type id[, y%]>
 *   属性命中時にバトラーのステートを変更します。
 *     x    : 属性ID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     y    : 確率 (任意設定。省略時は100)
 *
 * ---------------
 *
 *  <action state: x, type id>
 *  <action state: x, type id[, y%]>
 *   アクション命中時にバトラーのステートを変更します。
 *     x    : アクションID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     y    : 確率 (任意設定。省略時は100)
 *
 * ---------------
 *
 *  <stype state: x, type id>
 *  <stype state: x, type id[, y%]>
 *   スキルタイプ命中時にバトラーのステートを変更します。
 *     x    : スキルタイプID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     y    : 確率 (任意設定。省略時は100)
 *
 * ---------------
 *
 *  <itype state: x, type id>
 *  <itype state: x, type id[, y%]>
 *   アイテムタイプ命中時にバトラーのステートを変更します。
 *     x    : アイテムタイプID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     y    : 確率 (任意設定。省略時は100)
 *
 * ---------------
 *
 *  <custom skill state: x, type id>
 *   result = code
 *  </custom skill state>
 *   スキル命中時にバトラーのステートを変更するスクリプトを実行します。
 *     x    : スキルID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     code : 成功確率を返すコード
 *
 * ---------------
 *
 *  <custom item state: x, type id>
 *   result = code
 *  </custom item state>
 *   アイテム命中時にバトラーのステートを変更するスクリプトを実行します。
 *     x    : アイテムID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     code : 成功確率を返すコード
 *
 * ---------------
 *
 *  <custom element state: x, type id>
 *   result = code
 *  </custom element state>
 *   属性命中時にバトラーのステートを変更するスクリプトを実行します。
 *     x    : 属性ID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     code : 成功確率を返すコード
 *
 * ---------------
 *
 *  <custom action state: x, type id>
 *   result = code
 *  </custom action state>
 *   アクション命中時にバトラーのステートを変更するスクリプトを実行します。
 *     x    : アクションID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     code : 成功確率を返すコード
 *
 * ---------------
 *
 *  <custom stype state: x, type id>
 *   result = code
 *  </custom stype state>
 *   スキルタイプ命中時にバトラーのステートを変更するスクリプトを実行します。
 *     x    : スキルタイプID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     code : 成功確率を返すコード
 *
 * ---------------
 *
 *  <custom itype state: x, type id>
 *   result = code
 *  </custom itype state>
 *   アイテムタイプ命中時にバトラーのステートを変更するスクリプトを実行します。
 *     x    : アイテムタイプID
 *     type : 変更型 (付加:add / 解除:remove)
 *     id   : ステートID
 *     code : 成功確率を返すコード
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
 * ステートの耐性は有効なので、100%の確率でもそのステートに耐性を持っていたり、
 * 高い運を持っている対象であれば確実に適用されるわけではありません。
 *
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 *   <skill state: 4, add 5>
 *
 * ---------------
 *
 *   <item state: 5, remove 3>
 *
 * ---------------
 *
 *   <element state: 6, add 7, 50%>
 *
 * ---------------
 *
 *   <custom stype state: 1, add 4>
 *    result = 10 * a.luk / b.luk;
 *   </custom stype state>
 *
 */

(function () {

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.ActionStates.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.ActionStates.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'enemy', 'weapon', 'armor', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.ActionStates.loadNotes(data);
	};

	VictorEngine.ActionStates.loadNotes = function (data) {
		data.actionState = data.actionState || {}
		data.actionState.item = data.actionState.item || {};
		data.actionState.skill = data.actionState.skill || {};
		data.actionState.itype = data.actionState.itype || {};
		data.actionState.stype = data.actionState.stype || {};
		data.actionState.element = data.actionState.element || {};
		data.actionState.action = data.actionState.action || {};
		this.processNotes(data, "item");
		this.processNotes(data, "skill");
		this.processNotes(data, "itype");
		this.processNotes(data, "stype");
		this.processNotes(data, "action");
		this.processNotes(data, "element");
	};

	VictorEngine.ActionStates.processNotes = function (data, type) {
		var match;
		var code = type + ' state';
		var part1 = '[ ]*(\\d+),[ ]*(\\w+)[ ]*(\\d+)[ ]*';
		var part2 = '(?:,[ ]*([+-]?\\d+)?\\%?)?';
		var regex1 = new RegExp('<' + code + '[ ]*:' + part1 + part2 + '[ ]*>', 'gi');
		var regex2 = VictorEngine.getNotesValues('custom ' + code + '[ ]*:' + part1, 'custom ' + code);
		while ((match = regex1.exec(data.note)) !== null) {
			this.processValues(match, data.actionState[type]);
		};
		while ((match = regex2.exec(data.note)) !== null) {
			this.processValues(match, data.actionState[type], true);
		};
	};

	VictorEngine.ActionStates.processValues = function (match, data, code) {
		result = {};
		result.type = match[2].toLowerCase();
		result.state = Number(match[3]);
		result.rate = code ? 0 : Number(match[4]) || 100;
		result.code = code ? String(match[4]).trim() : 0;
		data[match[1]] = result;
	};

	//=============================================================================
	// Game_Action
	//=============================================================================

	VictorEngine.ActionStates.executeDamage = Game_Action.prototype.executeDamage;
	Game_Action.prototype.executeDamage = function (target, value) {
		VictorEngine.ActionStates.executeDamage.call(this, target, value);
		this.applyActionSatesEffect(this.isSkill(), this.item(), target);
	};

	Game_Action.prototype.applyActionSatesEffect = function (isSkill, item, target) {
		var states = this.getActionStatesValues(isSkill, item, target);
		states.forEach(function (data) {
			if (data.type === 'add') {
				this.addActionSates(data, target);
			} else if (data.type === 'remove') {
				this.removeActionSates(data, target);
			};
		}, this);
	};

	Game_Action.prototype.addActionSates = function (data, target) {
		var effect = {}
		effect.value1 = this.actionStateChance(data, target);
		effect.dataId = data.state;
		this.itemEffectAddNormalState(target, effect);
	};

	Game_Action.prototype.removeActionSates = function (data, target) {
		var effect = {}
		effect.value1 = this.actionStateChance(data, target);
		effect.dataId = data.state;
		this.itemEffectRemoveState(target, effect);
	};

	Game_Action.prototype.actionStateChance = function (data, target) {
		if (data.code) {
			return this.getActionStatesCode(data, target) / 100;
		} else {
			return data.rate / 100;
		}
	};

	Game_Action.prototype.getActionStatesCode = function (data, target) {
		try {
			var result = 0;
			var item = this.item();
			var a = this.subject();
			var b = target;
			var v = $gameVariables._data;
			eval(data.code)
			return Number(result) || 0;
		} catch (e) {
			return 0;
		}
	};

	Game_Action.prototype.getActionStatesValues = function (isSkill, item, target) {
		var object = this;
		var subject = this.subject();
		return target.traitObjects().reduce(function (r, data) {
			var value = object.getActionStatesData(subject, data.actionState, isSkill, item);
			return r.concat(value);
		}, []);
	};

	Game_Action.prototype.getActionStatesData = function (subject, data, isSkill, item) {
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
			value = data.action[stateId] || {};
			return r.concat(value);
		}, []);
		// var elmtnValue = VictorEngine.getAllElements(subject, item).reduce(function (r, elementId) {
		var elmtnValue = VictorEngine.getAllElements(subject, this).reduce(function (r, elementId) {
			value = data.element[elementId] || {};
			return r.concat(value);
		}, []);
		return result.concat(itemValue, typeValue, stateValue, elmtnValue);
	};

})(); 
