/*
 * ==============================================================================
 * ** Victor Engine MV - Action Conditions
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.11.29 > First release.
 *  v 1.01 - 2015.11.30 > Fixed issues with plugins using meta tags.
 *  v 1.02 - 2015.12.21 > Compatibility with Basic Module 1.04.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Action Conditions'] = '1.02';

var VictorEngine = VictorEngine || {};
VictorEngine.ActionConditions = VictorEngine.ActionConditions || {};

(function () {

	VictorEngine.ActionConditions.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.ActionConditions.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Action Conditions', 'VE - Basic Module', '1.04');
	};

	VictorEngine.ActionConditions.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.ActionConditions.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.02 - Adds different conditions for skill use.
 * @author Victor Sant
 *
 * @help
 * ------------------------------------------------------------------------------
 * Skill and Item Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <action condition: param check x>
 *  <action condition: param check x%>
 *   The action will be usable when the param checked match the value x.
 *     param : param name (maxhp, maxmp, maxtp, hp, mp, tp, atk, def, mat...)
 *     check : check type (higher, lower, equal or different)
 *	   x     : value checked (if param is hp, mp or tp, can be a % value)
 *
 * ---------------
 *
 *  <action condition: state check x>
 *   The action will be usable when the stated ID X match checked condition.
 *     check : check type (added or removed)
 *	   x     : stated ID
 *
 * ---------------
 *
 *  <action condition: switch check x>
 *   The action will be usable when the switch ID X match checked condition.
 *     check : check type (on or off)
 *	   x     : switch ID
 *
 * ---------------
 *
 *  <custom action condition>
 *   result = code
 *  </custom action condition>
 *   Can use a code to make the skill check.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 *
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "b" for the target, "v[x]" for variable and "item" for the item
 *  object. The 'result' must return a true/false value.
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *   <action condition: hp lower 50%>
 *
 * ---------------
 *
 *   <action condition: mp equal 0>
 *
 * ---------------
 *
 *   <action condition: sate added 3>
 *
 * ---------------
 *
 *   <action condition: switch on 5>
 *
 * ---------------
 *
 *   <custom action condition>
 *    result = $gameVariables.value(2) < 10;
 *   </custom action condition>
 *
 * ---------------
 *
 *   <custom action condition>
 *    result = $gameSwitches.value(1) || $gameSwitches.value(2);
 *   </custom action condition>
 */
/*:ja
 * @plugindesc v1.02 スキル・アイテムに使用条件がつけられます。
 * @author Victor Sant
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/action-conditions/
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
 * スキル、アイテムのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <action condition: param check x>
 *  <action condition: param check x%>
 *   能力が条件に一致した場合、使用不能になります。
 *     param : 能力   maxhp, maxmp, maxtp, hp, mp, tp, atk, def, mat...
 *     check : 確認型 higher(より大きい), lower(より小さい), equal(等しい) ,
 *                    different(等しくない)
 *     x     : 確認値 param が hp, mp ,tp の場合、%が使えます。
 *
 * ---------------
 *
 *  <action condition: state check x>
 *   ステートが条件に一致した場合、使用不能になります。
 *     check : 確認型 added(付加), removed(解除)
 *     x     : ステートID
 *
 * ---------------
 *
 *  <action condition: switch check x>
 *   スイッチID Xが条件に一致した場合、使用不能になります。
 *     check : 確認型 on , off
 *     x     : スイッチID
 *
 * ---------------
 *
 *  <custom action condition>
 *   result = code
 *  </custom action condition>
 *   コードを使ってスキル使用条件を決められます。
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 * コードではダメージの式と同じ値を使っているので、
 * 使用者には'a'、対象には'b'、変数には'v[x]'、
 * アイテムオブジェクトには'item'を使うことができます。
 * 結果はtrue/falseの値を返す必要があります。
 *
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 *   <action condition: hp lower 50%>
 *
 * ---------------
 *
 *   <action condition: mp equal 0>
 *
 * ---------------
 *
 *   <action condition: sate added 3>
 *
 * ---------------
 *
 *   <action condition: switch on 5>
 *
 * ---------------
 *
 *   <custom action condition>
 *    result = $gameVariables.value(2) < 10;
 *   </custom action condition>
 *
 * ---------------
 *
 *   <custom action condition>
 *    result = $gameSwitches.value(1) || $gameSwitches.value(2);
 *   </custom action condition>
 */


(function () {

	//=============================================================================
	// DataManager
	//=============================================================================

	VictorEngine.ActionConditions.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.ActionConditions.loadNotetagsValues.call(this, data, index);
		var list = ['skill', 'item'];
		if (this.objectSelection(index, list)) VictorEngine.ActionConditions.loadNotes(data);
	};

	VictorEngine.ActionConditions.loadNotes = function (data) {
		data.actionConditions = data.actionConditions || [];
		this.processNotes(data);
		this.processCustom(data);
	};

	VictorEngine.ActionConditions.processNotes = function (data) {
		var regex = new RegExp('<action condition:[ ]*(\\w+)[ ]*(\\w+)[ ]*(\\d+)(\\%)?[ ]*>', 'gi');
		var match;
		while ((match = regex.exec(data.note)) !== null) {
			result = {};
			result.type = match[1].toLowerCase();
			result.check = match[2].toLowerCase();
			result.value = Number(match[3]);
			result.rate = (match[4] && ['hp', 'mp', 'tp'].contains(result.type));
			data.actionConditions.push(result);
		};
	};

	VictorEngine.ActionConditions.processCustom = function (data) {
		var regex = VictorEngine.getNotesValues('custom action condition');
		var match;
		while ((match = regex.exec(data.note)) !== null) {
			result = {};
			result.type = 'script';
			result.value = match[1];
			data.actionConditions.push(result);
		};
	};

	//=============================================================================
	// Game_BattlerBase
	//=============================================================================

	VictorEngine.ActionConditions.meetsUsableItemConditions = Game_BattlerBase.prototype.meetsUsableItemConditions;
	Game_BattlerBase.prototype.meetsUsableItemConditions = function (item) {
		if (!this.meetCustomActionConditions(item)) return false;
		return VictorEngine.ActionConditions.meetsUsableItemConditions.call(this, item);
	};

	Game_BattlerBase.prototype.meetCustomActionConditions = function (item) {
		if (!item || !item.actionConditions) return true;
		if (this.testCustomActionConditions(item)) return false;
		return true;
	};

	Game_BattlerBase.prototype.testCustomActionConditions = function (item) {
		var result = false;
		item.actionConditions.forEach(function (condition) {
			if (condition.type === 'script') {
				var a = this;
				var v = $gameVariables._data;
				if (!result) eval(condition.value);
			} else {
				if (!result && this.actionConditionParam(condition)) result = true;
			};
		}, this);
		return !!result;
	};

	Game_BattlerBase.prototype.actionConditionParam = function (condition) {
		if (condition.type === 'switch') {
			return $gameSwitches.value(condition.value) === (condition.check === 'on');
		} else if (condition.type === 'state') {
			return this.isStateAffected(condition.value) === (condition.check === 'added');
		} else {
			if (condition.rate) { var rate = 'Rate() * 100' } else { var rate = '' };
			var result = 'this.' + condition.type + rate;
			if (condition.check === 'higher' && eval(result) < condition.value) return true;
			if (condition.check === 'lower' && eval(result) > condition.value) return true;
			if (condition.check === 'equal' && eval(result) !== condition.value) return true;
			if (condition.check === 'different' && eval(result) === condition.value) return true;
		};
		return false;
	};

})();