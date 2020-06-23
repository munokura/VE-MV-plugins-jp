/*
 * ==============================================================================
 * ** Victor Engine MV - CastAnimations
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.01.17 > First release.
 *  v 1.01 - 2016.01.24 > Compatibility with Basic Module 1.09.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Cast Animations'] = '1.01';

var VictorEngine = VictorEngine || {};
VictorEngine.CastAnimations = VictorEngine.CastAnimations || {};

(function () {

	VictorEngine.CastAnimations.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.CastAnimations.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Cast Animations', 'VE - Basic Module', '1.09');
	};

	VictorEngine.CastAnimations.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.CastAnimations.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.01 - Display animation on the user when using skills or items.
 * @author Victor Sant
 *
 * @param Message Before Cast
 * @desc Display action use message before the cast animation.
 * true - ON	false - OFF
 * @default true
 *
 * @help 
 * ------------------------------------------------------------------------------
 *  Skills and Items Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <cast animation: Id>
 *   Animation displayed at the action start, before the step forward.
 *    Id : animation Id.
 *
 * ---------------
 *
 *  <action animation: Id>
 *   Animation displayed before the action, after the step forward.
 *    Id : animation Id.
 *
 * ------------------------------------------------------------------------------
 * Actors, Classes, Enemies, Weapons, Armors and States Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <no cast animation>
 *   The battler will not display a cast animation, even if the action have
 *   the proper tag.
 *
 */
/*:ja
 * @plugindesc v1.01 スキルやアイテム使用時に使用者にアニメーションを表示します。
 * @author Victor Sant
 *
 * @param Message Before Cast
 * @text アニメーション前メッセージ
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc アクション開始アニメーション前に使用メッセージを表示
 * 有効:true / 無効:false
 * @default true
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/cast-animations/
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
 *  スキル、アイテムのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <cast animation: Id>
 *   アクション開始アニメーションは、アクターが前進前に表示されます。
 *    Id : アニメーションID
 *
 * ---------------
 *
 *  <action animation: Id>
 *   アクション開始アニメーションは、アクターが前進後に表示されます。
 *    Id : アニメーションID
 *
 * ---------------------------------------------------------------------------
 * アクター、職業、敵グループ、武器、防具、ステートのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <no cast animation>
 *   アクションにタグが付いていても、
 *   バトラーはアクション開始アニメーションを表示しません。
 */

(function () {

	//=============================================================================
	// Parameters
	//=============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.CastAnimations = {};
		VictorEngine.Parameters.CastAnimations.Message = eval(parameters["Message Before Cast"]);
	};

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.CastAnimations.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.CastAnimations.loadNotetagsValues.call(this, data, index);
		var list = ['skill', 'item'];
		if (this.objectSelection(index, list)) VictorEngine.CastAnimations.loadNotes1(data);
		var list = ['actor', 'class', 'weapon', 'armor', 'enemy', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.CastAnimations.loadNotes2(data);
	};

	VictorEngine.CastAnimations.loadNotes1 = function (data) {
		var match;
		var regex1 = new RegExp('<cast animation:[ ]*(\\d+)[ ]*>', 'gi');
		var regex2 = new RegExp('<action animation:[ ]*(\\d+)[ ]*>', 'gi');
		while ((match = regex1.exec(data.note)) !== null) { data.castAnimation = Number(match[1]) };
		while ((match = regex2.exec(data.note)) !== null) { data.actionAnimation = Number(match[1]) };
	};

	VictorEngine.CastAnimations.loadNotes2 = function (data) {
		var match;
		var regex = new RegExp('<no cast animation>', 'gi');
		while ((match = regex.exec(data.note)) !== null) { data.noCastAnimation = true };
	};

	//=============================================================================
	// Window_BattleLog
	//=============================================================================

	VictorEngine.CastAnimations.startAction = Window_BattleLog.prototype.startAction;
	Window_BattleLog.prototype.startAction = function (subject, action, targets) {
		var item = action.item();
		if (VictorEngine.Parameters.CastAnimations.Message) {
			VictorEngine.CastAnimations.displayAction.call(this, subject, item);
		}
		VictorEngine.CastAnimations.startAction.call(this, subject, action, targets);
		if (item && item.actionAnimation && !subject.noCastAnimation) {
			this.addActionAnimation(subject, item.actionAnimation);
		}
		if (item && item.castAnimation && !subject.noCastAnimation) {
			this.addCastAnimation(subject, item.castAnimation);
		}
	};

	VictorEngine.CastAnimations.displayAction = Window_BattleLog.prototype.displayAction;
	Window_BattleLog.prototype.displayAction = function (subject, item) {
		if (!VictorEngine.Parameters.CastAnimations.Message) {
			VictorEngine.CastAnimations.displayAction.call(this, subject, item);
		} else {
			this.push('wait');
		}
	};

	Window_BattleLog.prototype.addActionAnimation = function (subject, animationId) {
		var index = VictorEngine.methodIndex(this._methods, 'performAction') || 0;
		VictorEngine.insertMethod(this._methods, index, 'waitForBattleAnimation', [animationId]);
		VictorEngine.insertMethod(this._methods, index, 'performActionAnimation', [subject, animationId]);
	};

	Window_BattleLog.prototype.addCastAnimation = function (subject, animationId) {
		var index = VictorEngine.methodIndex(this._methods, 'performActionStart') || 0;
		VictorEngine.insertMethod(this._methods, index, 'waitForBattleAnimation', [animationId]);
		VictorEngine.insertMethod(this._methods, index, 'performCastAnimation', [subject, animationId]);
	};

	Window_BattleLog.prototype.performActionAnimation = function (subject, animationId) {
		subject.startAnimation(animationId, false, 0);
	};

	Window_BattleLog.prototype.performCastAnimation = function (subject, animationId) {
		subject.startAnimation(animationId, false, 0);
	};

})(); 