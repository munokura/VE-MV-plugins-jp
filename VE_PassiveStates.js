/*
 * ==============================================================================
 * ** Victor Engine MV - Passive States
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.11.27 > First release.
 *  v 1.01 - 2015.11.30 > Fixed issues with plugins using meta tags.
 *  v 1.02 - 2015.12.21 > Compatibility with Basic Module 1.04.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Passive States'] = '1.02';

var VictorEngine = VictorEngine || {};
VictorEngine.PassiveStates = VictorEngine.PassiveStates || {};

(function () {

	VictorEngine.PassiveStates.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.PassiveStates.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Passive States', 'VE - Basic Module', '1.04');
	};

	VictorEngine.PassiveStates.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.PassiveStates.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.02 - Setup states to be always active.
 * @author Victor Sant
 *
 * @help 
 * ------------------------------------------------------------------------------
 * Actors, Classes, Wapons, Armors, States, Enemies and Skills Notetags:
 * ------------------------------------------------------------------------------
 *  
 *  <passive state: id>
 *   The state will be always active on objects with this tag.
 *     id : state ID
 *
 * ---------------
 *
 *  <passive state: id, param check x>
 *  <passive state: id, param check x%>
 *   The state will be active when the param checked match the value x.
 *     id    : state id
 *     param : param name (maxhp, maxmp, maxtp, hp, mp, tp, atk, def, mat...)
 *     check : check type (higher, lower, equal or different)
 *	   x     : value checked (if param is hp, mp or tp, can be a % value)
 *
 * ---------------
 *
 *  <passive state: id, state check x>
 *   The state will be active when the stated ID x match checked condition.
 *     id    : stated ID (stated ativated)
 *     check : check type (added or removed)
 *	   X     : stated ID (state checked)
 *
 * ---------------
 *
 *  <passive state: id, switch check x>
 *   The state will be active when the switch ID x match checked condition.
 *     id    : state ID
 *     check : check type (on or off)
 *	   x     : switch ID
 *
 * ---------------
 *
 *  <custom passive state: id>
 *   result = code
 *  </custom passive state>
 *  Can use a code to make the skill check. The code must return true or false.
 *  Require coding knowledge.
 *     id   : state ID
 *     code : js code
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
 *   <passive state: 4, hp lower 50%>
 *
 * ---------------
 *
 *   <passive state: 5, mp equal 0>
 *
 * ---------------
 *
 *   <passive state: 6, sate added 3>
 *
 * ---------------
 *
 *   <passive state: 7, switch on 5>
 *
 * ---------------
 *
 *   <custom passive state: 8>
 *    result = $gameVariables.value(2) < 10;
 *   </custom passive state>
 *
 * ---------------
 *
 *   <custom passive state: 9>
 *    result = $gameSwitches.value(1) || $gameSwitches.value(2);
 *   </custom passive state>
 * 
 */
/*:ja
 * @plugindesc v1.02 パッシブステートの付加条件を設定できます
 * @author Victor Sant
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/passive-states/
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
 * アクター、職業、武器、防具、ステート、敵、スキルのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <passive state: id>
 *   このステートは、このタグを持つオブジェクトに対して常に有効化されます。
 *     id : ステートID
 *
 * ---------------
 *
 *  <passive state: id, param check x>
 *  <passive state: id, param check x%>
 *   能力が条件に一致した場合、ステートが解除されます。
 *     id    : ステートID
 *     param : 能力名 (maxhp, maxmp, maxtp, hp, mp, tp, atk, def, mat...)
 *     check : 確認型 より大きい:higher / より小さい:lower / 等しい:equal /
 *                    等しくない:different
 *     x     : 確認値 param が hp, mp ,tp の場合、%が使えます。
 *
 * ---------------
 *
 *  <passive state: id, state check x>
 *   ステートxが条件に一致した場合、ステートが解除されます。
 *     id    : ステートID (有効化ステート)
 *     check : 確認型 付加:added / 解除:removed
 *     x     : ステートID (確認されるステート)
 *
 * ---------------
 *
 *  <passive state: id, switch check x>
 *   スイッチIDxが条件に一致した場合、ステートが解除されます。
 *     id    : ステートID
 *     check : 確認型 on / off
 *     x     : スイッチID
 *
 * ---------------
 *
 *  <custom passive state: id>
 *   result = code
 *  </custom passive state>
 *  コードを使って確認を行うことができます。
 *  コードはtrueかfalseを返す必要があります。
 *  コーディングの知識が必要です。
 *     id   : ステートID
 *     code : JavaScriptコード
 *
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 * コードではダメージ式と同じ値を使っているので、使用者には'a'、対象には'b'、
 * 変数には'v[x]'、アイテムオブジェクトには'item'を使うことができます。
 * 'result'は true/false の値を返す必要があります。
 *
 *
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 *   <passive state: 4, hp lower 50%>
 *
 * ---------------
 *
 *   <passive state: 5, mp equal 0>
 *
 * ---------------
 *
 *   <passive state: 6, sate added 3>
 *
 * ---------------
 *
 *   <passive state: 7, switch on 5>
 *
 * ---------------
 *
 *   <custom passive state: 8>
 *    result = $gameVariables.value(2) < 10;
 *   </custom passive state>
 *
 * ---------------
 *
 *   <custom passive state: 9>
 *    result = $gameSwitches.value(1) || $gameSwitches.value(2);
 *   </custom passive state>
 *
 */

(function () {

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.PassiveStates.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.PassiveStates.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'enemy', 'weapon', 'armor', 'state', 'skill'];
		if (this.objectSelection(index, list)) VictorEngine.PassiveStates.loadNotes(data);
	};

	VictorEngine.PassiveStates.loadNotes = function (data) {
		data.passiveStates = data.passiveStates || [];
		this.processNotes(data);
		this.processCustom(data);
	};

	VictorEngine.PassiveStates.processNotes = function (data) {
		var part1 = '(?:[ ]*,[ ]*(\\w+)[ ]*(\\w+)[ ]*(\\d+)(\\%)?)?';
		var regex = new RegExp('<passive state:[ ]*(\\d+)' + part1 + '[ ]*>', 'gi');
		var match;
		while ((match = regex.exec(data.note)) !== null) {
			this.processValues(match, data.passiveStates);
		};
	};

	VictorEngine.PassiveStates.processValues = function (match, data) {
		result = {};
		result.state = Number(match[1]);
		if (match[2] === undefined) {
			result.type = 'always';
		} else {
			result.type = match[2].toLowerCase();
			result.check = match[3].toLowerCase();
			result.value = Number(match[4]);
			result.rate = (match[5] !== undefined && ['hp', 'mp', 'tp'].contains(result.type));
		};
		data.push(result);
	};

	VictorEngine.PassiveStates.processCustom = function (data) {
		var regex = VictorEngine.getNotesValues('custom passive state:[ ]*(\\d+)[ ]*', 'custom passive state');
		var match;
		while ((match = regex.exec(data.note)) !== null) {
			result = {};
			result.state = Number(match[1]);
			result.type = 'script';
			result.value = match[2];
			data.passiveStates.push(result);
		};
	};

	//=============================================================================
	// Game_BattlerBase
	//=============================================================================

	VictorEngine.PassiveStates.initMembers = Game_BattlerBase.prototype.initMembers;
	Game_BattlerBase.prototype.initMembers = function () {
		this._passiveStates = [];
		VictorEngine.PassiveStates.initMembers.call(this);
	};

	VictorEngine.PassiveStates.refresh = Game_BattlerBase.prototype.refresh;
	Game_BattlerBase.prototype.refresh = function () {
		this.refreshPassiveStates();
		VictorEngine.PassiveStates.refresh.call(this);
	};

	Game_BattlerBase.prototype.refreshPassiveStates = function () {
		this.removePassiveStates();
		this.setupPassiveStates();
	};

	Game_BattlerBase.prototype.removePassiveStates = function () {
		this._passiveStates.forEach(function (stateId) {
			this.eraseState(stateId)
		}, this);
		this._passiveStates = [];
	};

	Game_BattlerBase.prototype.setupPassiveStates = function () {
		this.traitObjects().forEach(function (obj) { this.addPassiveStates(obj) }, this);
		if (this.isActor()) this.skills().forEach(function (obj) { this.addPassiveStates(obj) }, this);
	};

	Game_BattlerBase.prototype.addPassiveStates = function (obj) {
		obj.passiveStates.forEach(function (value) {
			if (this.testNewPassiveState(value)) this.addNewPassiveStates(value.state);
		}, this);
	};

	Game_BattlerBase.prototype.testNewPassiveState = function (state) {
		if (state.type === 'script') {
			var result = false;
			var a = this;
			var v = $gameVariables._data;
			eval(state.value)
			return result;
		} else {
			return this.passiveStateParam(state);
		};
	};

	Game_BattlerBase.prototype.passiveStateParam = function (state) {
		if (state.type === 'always') {
			return true;
		} else if (state.type === 'switch') {
			return $gameSwitches.value(state.value) === (state.check === 'on');
		} else if (state.type === 'state') {
			return this.isStateAffected(state.value) === (state.check === 'added');
		} else {
			if (state.rate) { var rate = 'Rate() * 100' } else { var rate = '' };
			var evalStr = 'this.' + state.type + rate;
			if (state.check === 'higher' && eval(evalStr) > state.value) return true;
			if (state.check === 'lower' && eval(evalStr) < state.value) return true;
			if (state.check === 'equal' && eval(evalStr) === state.value) return true;
			if (state.check === 'different' && eval(evalStr) !== state.value) return true;
		};
		return false;
	};

	Game_BattlerBase.prototype.addNewPassiveStates = function (stateId) {
		if (this.isAlive()) {
			if (!this._passiveStates.contains(stateId)) this._passiveStates.push(stateId);
			if (!this.isStateAffected(stateId)) {
				if (stateId === this.deathStateId()) this.die();
				var restricted = this.isRestricted();
				this._states.push(stateId);
				this.sortStates();
			};
		}
	};

	//=============================================================================
	// Game_Party
	//=============================================================================

	Game_Party.prototype.refreshPassiveStates = function () {
		this.allMembers().forEach(function (member) {
			member.refreshPassiveStates();
		});
	};

	//=============================================================================
	// Scene_Base
	//=============================================================================

	VictorEngine.PassiveStates.start = Scene_Base.prototype.start;
	Scene_Base.prototype.start = function () {
		VictorEngine.PassiveStates.start.call(this);
		if ($gameParty !== null) $gameParty.refreshPassiveStates()
	};

})(); 