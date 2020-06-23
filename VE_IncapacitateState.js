/*
 * ==============================================================================
 * ** Victor Engine MV - Incapacitate State
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.03.01 > First release.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Incapacitate State'] = '1.00';

var VictorEngine = VictorEngine || {};
VictorEngine.IncapacitateState = VictorEngine.IncapacitateState || {};

(function () {

	VictorEngine.IncapacitateState.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.IncapacitateState.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Incapacitate State', 'VE - Basic Module', '1.12');
	};

	VictorEngine.IncapacitateState.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.IncapacitateState.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.00 - Create states that makes the target to be considered dead.
 * @author Victor Sant
 *
 * @help 
 * States Notetags:
 *
 *  <incapacitate state>
 *   States with this tag will make the target to be considered to be affected
 *   by a 'death state', even if is is not actually dead. If all battlers are
 *   dead/incapactated, their team will lose the fight. (For the party this
 *   means game over)
 *
 * Additional Information:
 * 
 *   Even though the target is considered affected by the death state, this only
 *   have effect on the the win/lose checks. The target can still act freely 
 *   unless you set a restriction on the state.
 * 
 *   The target can also be targeted and damaged normally unless you change this.
 *   You can, for example, set 'Target Rate' to 0%, or use a plugin, such as the
 *   'VE - Unreachable Targets' to make the target untargetable.
 *
 */
/*:ja
 * @plugindesc v1.00 戦闘不能扱いにするステートを作れます
 * @author Victor Sant
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/incapacitate-states/
 *
 * ===========================================================================
 * 必要プラグイン
 * ===========================================================================
 * このプラグインを使用するには、下記のプラグインが必要です。
 * - VE_BasicModule
 *
 *
 * ===========================================================================
 * ステートのメモタグ
 * ===========================================================================
 * <incapacitate state>
 *
 * このタグが付いているステートでは、
 * 実際には死んでいなくても'戦闘不能ステート'を受けているとみなされます。
 * 全てのバトラーが戦闘不能/不活性化している場合、
 * そのチームはその戦闘に敗北します。
 * (パーティにとってはゲームオーバーを意味します)
 *
 *
 * ===========================================================================
 * 追加情報
 * ===========================================================================
 * 対象が戦闘不能ステートの影響を受けていると判断されても、
 * 勝敗チェックにしか影響しません。
 * ステートに制限を設けない限り、対象は自由に行動できます。
 *
 * また、これを変更しない限り、対象にも通常のダメージを与えることができます。
 * 例えば狙われ率を0%にしたり、
 * VE_UnreachableTarget のようなプラグインを使って
 * 対象を非対象にすることができます。
 */

(function () {

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.IncapacitateState.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.IncapacitateState.loadNotetagsValues.call(this, data, index);
		if (this.objectSelection(index, ['state'])) VictorEngine.IncapacitateState.loadNotes(data);
	};

	VictorEngine.IncapacitateState.loadNotes = function (data) {
		var regex = new RegExp("<incapacitate state>", 'gi');
		data.incapacitateState = !!data.note.match(regex)
	};

	//=============================================================================
	// Game_BattlerBase
	//=============================================================================

	Game_BattlerBase.prototype.isIncapacitated = function () {
		return this.states().some(function (state) { return state.incapacitateState });
	};

	//=============================================================================
	// Game_Unit
	//=============================================================================

	VictorEngine.IncapacitateState.isAllDead = Game_Unit.prototype.isAllDead;
	Game_Unit.prototype.isAllDead = function () {
		return VictorEngine.IncapacitateState.isAllDead.call(this) || this.isAllIncapacitated();
	};

	Game_Unit.prototype.isAllIncapacitated = function () {
		return !this.aliveMembers().some(function (member) { return !member.isIncapacitated() });
	};

})();