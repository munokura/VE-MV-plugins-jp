/*
 * ==============================================================================
 * ** Victor Engine MV - Reflect Actions
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.12.07 > First release
 *  v 1.01 - 2015.12.21 > Compatibility with Basic Module 1.04.
 *  v 1.02 - 2016.01.20 > Compatibility with Basic Module 1.08.
 *  v 1.03 - 2016.01.24 > Compatibility with Basic Module 1.09.
 *  v 1.04 - 2016.03.04 > Improved code for better handling script codes.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Reflect Actions'] = '1.04';

var VictorEngine = VictorEngine || {};
VictorEngine.ReflectActions = VictorEngine.ReflectActions || {};

(function () {

	VictorEngine.ReflectActions.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.ReflectActions.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Reflect Actions', 'VE - Basic Module', '1.09');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Reflect Actions', 'VE - Retaliation Damage');
	};

	VictorEngine.ReflectActions.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.ReflectActions.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.04 - Setup different triggers for the reflect trait.
 * @author Victor Sant
 *
 * @param Reflect Animation
 * @desc ID of the animation displayed when a action is reflected.
 * Default: 0. (No animation)
 * @default 0
 *
 * @param Display Reflected
 * @desc Display animation of the action on the user if reflected.
 * true - ON	false - OFF
 * @default false
 *
 * @help 
 * ------------------------------------------------------------------------------
 * Actors, Classes, Enemies, Weapons, Armors and States Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <action reflect: trigger, rate>
 *  Setup a custom reflect effect. 
 *    trigger : the action that will trigger the reflect. (see below)
 *    rate    : chance of triggering.
 *
 * ---------------
 *
 *  <custom action reflect: trigger>
 *   result = code
 *  </custom action reflect>
 *  Process a script code to setup a custom reflect effect. 
 *    trigger : the action that will trigger the reflect. (see below)
 *    code    : code that will return the rate value.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  - Triggers
 *   One of the following values can be used as triggers
 *      skill x   | Reflect when hit by the skill ID = x
 *      item x    | Reflect when hit by the item ID = x
 *      stype x   | Reflect when hit by skills with skill type ID x
 *      itype x   | Reflect when hit by items with item type ID x
 *      element x | Reflect when hit by actions with element ID x
 *      physical  | Reflect when hit by physical damage
 *      magical   | Reflect when hit by magical damage
 *      damage    | Reflect when hit by any damage
 *      any       | Reflect when hit by any action
 *
 * ---------------
 *
 *  - Code
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "b" for the target, "v[x]" for variable and "item" for the item
 *  object. The 'result' must return a numeric value between 0 and 100. (values
 *  outside of this range are redundant)
 *
 * ---------------
 *
 *  The main difference between the Reflect and Counter is that the reflect return
 *  the skill to it's caster and uses the caster own stats to calculate the effect.
 *  By default only magics can be reflected, but this pluugin extend that function.
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *   <action reflect: physical, 20%>
 *
 * ---------------
 *
 *   <action reflect: damage, 50%>
 *
 * ---------------
 *
 *   <action reflect: skill 1, 25%>
 *
 * ---------------
 *
 *   <action reflect code: stype 1>
 *    result = a.level;
 *   </action reflect code>
 *
 * ------------------------------------------------------------------------------
 * Compatibility:
 * ------------------------------------------------------------------------------
 *
 * - When used together with the plugin 'VE - Retaliation Damage', place this
 *   plugin above it.
 */
/*:ja
 * @plugindesc v1.04 反射の発動条件を魔法以外にも設定できます
 * @author Victor Sant
 *
 * @param Reflect Animation
 * @text 反射時アニメーションID
 * @desc 反射時の表示アニメーションID
 * 非表示は0に
 * @default 53
 *
 * @param Display Reflected
 * @text 反射されたアニメーション表示
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc 反射されたスキルのアニメーションを表示
 * 表示:true / 非表示:false
 * @default false
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/reflect-actions/
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
 * アクター、職業、敵、武器、防具、ステートのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <action reflect: trigger, rate>
 *  カスタム反射効果を設定します。
 *    trigger : 反射の発動条件を指定します。（後述）
 *    rate    : 反射率を指定します。
 *
 * ---------------
 *
 *  <custom action reflect: trigger>
 *   result = code
 *  </custom action reflect>
 *  カスタム反射効果を設定するスクリプトを実行します。
 *    trigger : 反射の発動条件を指定します。（後述）
 *    code    : コードを使用して、反射率を返します。
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 *  - Triggers
 *   以下のいずれかを発動条件として使用できます。
 *      skill x   | スキルIDxで命中した時に反射
 *      item x    | アイテムIDxで命中した時に反射
 *      stype x   | スキルタイプIDxのスキルが命中した時に反射
 *      itype x   | アイテムタイプIDxのアイテムが命中した時に反射
 *      element x | 属性IDxのアクションが命中した時に反射
 *      physical  | 物理ダメージを受けると反射
 *      magical   | 魔法ダメージを受けると反射
 *      damage    | 何らかのダメージを受けると反射
 *      any       | 任意のアクションが命中した時に反射
 *
 * ---------------
 *
 *  - Code
 * コードではダメージ式と同じ値を使っているので、使用者には'a'、対象には'b'、
 * 変数には'v[x]'、アイテムオブジェクトには'item'を使います。
 * 'result'は0から100までの数値を返す必要があります。
 * (この範囲外の値は冗長)
 *
 * ---------------
 *
 * 反射と反撃の主な違いは、反射はスキルを使用者に返し、
 * その効果を計算するために使用者自身の能力値を使用することです。
 * RPGツクールMVデフォルトでは魔法のみが反射されますが、
 * このプラグイン機能はデフォルトを拡張したものです。
 *
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 *   <action reflect: physical, 20%>
 *
 * ---------------
 *
 *   <action reflect: damage, 50%>
 *
 * ---------------
 *
 *   <action reflect: skill 1, 25%>
 *
 * ---------------
 *
 *   <action reflect code: stype 1>
 *    result = a.level;
 *   </action reflect code>
 *
 * ---------------------------------------------------------------------------
 * 互換性
 * ---------------------------------------------------------------------------
 *
 * - 'VE - Retaliation Damage'プラグインと併用する場合、
 * このプラグインをそれより上方に配置してください。
 */

(function () {

	//=============================================================================
	// Parameters
	//=============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.ReflectActions = {};
		VictorEngine.Parameters.ReflectActions.ReflectAnimation = Number(parameters["Reflect Animation"]) || 0;
		VictorEngine.Parameters.ReflectActions.DisplayReflected = eval(parameters["Display Reflected"]);
	};

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.ReflectActions.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.ReflectActions.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'enemy', 'weapon', 'armor', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.ReflectActions.loadNotes(data);
	};

	VictorEngine.ReflectActions.loadNotes = function (data) {
		data.reflectActions = data.reflectActions || [];
		this.processNotes(data);
	};

	VictorEngine.ReflectActions.processNotes = function (data) {
		var match;
		var code = 'action reflect';
		var part1 = ':[ ]*(\\w+)[ ]*(\\d+)?[ ]*';
		var regex1 = new RegExp('<' + code + part1 + '[ ]*,[ ]*(\\d+)[%]?[ ]*>', 'gi');
		var regex2 = VictorEngine.getNotesValues('custom ' + code + part1, 'custom ' + code);
		while ((match = regex1.exec(data.note)) !== null) { this.processValues(match, data, false) };
		while ((match = regex2.exec(data.note)) !== null) { this.processValues(match, data, true) };
	};

	VictorEngine.ReflectActions.processValues = function (match, data, code) {
		var result = {};
		result.type = match[1].toLowerCase();
		result.typeId = Number(match[2]) || 0;
		result.rate = code ? 0 : Number(match[3]) || 0;
		result.code = code ? String(match[3]).trim() : '';
		data.reflectActions.push(result);
	};

	//=============================================================================
	// BattleManager
	//=============================================================================

	VictorEngine.ReflectActions.invokeMagicReflection = BattleManager.invokeMagicReflection;
	BattleManager.invokeMagicReflection = function (subject, target) {
		if (this._action._reflectAction) {
			BattleManager.startReflectAction(subject, target);
		} else {
			VictorEngine.ReflectActions.invokeMagicReflection.call(this, subject, target);
		};
	};

	BattleManager.startReflectAction = function (subject, target) {
		this._logWindow.startReflectAction(subject, target, this._action);
		this._action._reflectAction = null;
	};

	//=============================================================================
	// Game_Action
	//=============================================================================

	VictorEngine.ReflectActions.itemMrf = Game_Action.prototype.itemMrf;
	Game_Action.prototype.itemMrf = function (target) {
		if (this.checkReflectAction(target)) {
			return 1;
		} else {
			return VictorEngine.ReflectActions.itemMrf.call(this, target);
		};
	};

	Game_Action.prototype.checkReflectAction = function (target) {
		if (this.subject() === target) return false;
		this._reflectAction = this.getReflectAction(target);
		return this._reflectAction;
	};

	Game_Action.prototype.getReflectAction = function (target) {
		var list = this.getReflectActionsValues(target)
		return list.some(function (data) {
			return this.testReflectAction(data, target);
		}, this);
	};

	Game_Action.prototype.testReflectAction = function (data, target) {
		if (!data || (target.isEnemy() && data.action === 'item')) return false;
		var item = this.item();
		if ((data.type === 'skill' && this.isSkill() && item.id == data.typeId) ||
			(data.type === 'item' && this.isItem() && item.id == data.typeId) ||
			(data.type === 'stype' && this.isSkill() && item.stypeId == data.typeId) ||
			(data.type === 'itype' && this.isItem() && item.itypeId == data.typeId) ||
			(data.type === 'element' && item.damage.elementId == data.typeId) ||
			(data.type === 'physical' && this.isPhysical()) ||
			(data.type === 'magical' && this.isMagical()) ||
			(data.type === 'damage' && ![3, 4].contains(item.damage.type)) ||
			(data.type === 'any')) {
			return this.testReflectActionSuccess(data, target);
		} else {
			return false;
		};
	};

	Game_Action.prototype.testReflectActionSuccess = function (data, target) {
		if (data.action === 'item' && !target.canUse($dataItems[data.actionId])) return false;
		if (data.action === 'skill' && !target.canUse($dataSkills[data.actionId])) return false;
		if (data.rate) return Math.random() < data.rate / 100;
		if (data.code) return Math.random() < this.getReflectActionsCode(data, target);
		return false;
	};

	Game_Action.prototype.getReflectActionsCode = function (data, target) {
		try {
			var result = 0;
			var item = this.item();
			var b = this.subject();
			var a = target;
			var v = $gameVariables._data;
			eval(data.code)
			return (Number(result / 100)) || 0;
		} catch (e) {
			return 0;
		}
	};

	Game_Action.prototype.getReflectActionsValues = function (target) {
		return target.traitObjects().reduce(function (r, data) {
			return r.concat(data.reflectActions);
		}, []);
	};

	//=============================================================================
	// Window_BattleLog
	//=============================================================================

	Window_BattleLog.prototype.startReflectAction = function (subject, target, action) {
		var animation = VictorEngine.Parameters.ReflectActions.ReflectAnimation;
		if (animation > 0) {
			this.push('showAnimation', target, [target], animation);
			this.push('waitForBattleAnimation', animation);
		}
		this.displayReflection(target);
		if (VictorEngine.Parameters.ReflectActions.DisplayReflected) {
			this.push('showAnimation', subject, [subject], action.item().animationId);
			this.push('waitForBattleAnimation', action.item().animationId);
		}
		action.apply(subject);
		this.displayActionResults(subject, subject);
	};

})(); 