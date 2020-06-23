/*
 * ==============================================================================
 * ** Victor Engine MV - Replace Actions
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.03.12 > First release.
 *  v 1.01 - 2016.03.15 > Added more replace triggers.
 *  v 1.02 - 2016.03.18 > Compatibility with Dual Wield.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Replace Actions'] = '1.02';

var VictorEngine = VictorEngine || {};
VictorEngine.ReplaceActions = VictorEngine.ReplaceActions || {};

(function () {

	VictorEngine.ReplaceActions.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.ReplaceActions.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Replace Actions', 'VE - Basic Module', '1.15');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Replace Actions', 'VE - Dual Wield');
	};

	VictorEngine.ReplaceActions.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.ReplaceActions.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.02 - Replaces skills used with another skill on battle.
 * @author Victor Sant
 *
 * @help 
 * ------------------------------------------------------------------------------
 * Actors, Classes, Weapons, Armors and States Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <action replace: trigger, X, Y%[, priority]>
 *   Replace the action with a new skill.
 *     trigger : action that will trigger the replace skill. (see bellow)
 *     X : id of the skill used. Numeric.
 *     Y : chance of replacing the skill. 0-100%.
 *     priority : priority of the skill. Numeric. Optional.
 *
 * ---------------
 *
 *  <custom action replace: trigger[, priority]>
 *   result = code
 *  </custom action replace>
 *   Use a script code to replace the attack skill with a new skill.
 *     code : code that will return the skill id.
 *     priority : priority of the skill. Numeric. Optional.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user "v[x]" for variable. The 'result' must return a numeric value.
 *  If the result is 0 (or not defined), the action won't be replaced.
 *
 * ---------------
 *
 *  - Trigger
 *  The trigger must be one of the following values can be used as triggers.
 *      skill x   : Replace action when using the skill Id X.
 *      item x    : Replace action when using the item Id X.
 *      stype x   : Replace action when using skills with skill type Id X.
 *      itype x   : Replace action when using items with item type Id X.
 *      element x : Replace action when using actions with element Id X.
 *      attack    ; Replace action when using basic attack.
 *      guard     : Replace action when using guard skill.
 *      physical  : Replace action when using physical damage.
 *      magical   : Replace action when using magical damage.
 *      any       : Replace action when using any action.
 *
 * ---------------
 *
 *  - Priority
 *  The priority is an arbitrary numeric value used to decide wich action will
 *  be used if multiples replace tags exist. The skill with highest priority
 *  will be choosen. If there are different skills with the same priority, then
 *  the skill with lowest Id will be used.
 *
 * ---------------
 *
 *  If the original action targets all, the new action will also target all.
 *  If the original action targets single, and the new action targets all, the
 *  action will target all. 
 *
 *  This don't change the target scope of the action, so if the original is
 *  targeting an enemy, but the new action would target an ally, the action will
 *  still target enemies.
 *
 * ---------------
 *
 *  The costs of the original action aren't consumed, instead the new action
 *  cost will be used. This is very important for items, that will not be used,
 *  and instead will have the skill cost used.
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <action replace: attack, 9, 100%>
 *
 * ---------------
 *
 *  <action replace: skill 10, 75%, 5>
 *
 * ---------------
 *
 *  <custom action replace: magical>
 *   if (v[10] < 100) {
 *       result = 10;
 *   } else {
 *       result = 0;
 *   }
 *  </custom action replace>
 *
 * ---------------
 *
 *  <custom action replace: guard, 10>
 *   if (a.level < 10) {
 *       result = 11;
 *   } else {
 *       result = 12;
 *   }
 *  </custom action replace>
 *
 * ------------------------------------------------------------------------------
 * Compatibility:
 * ------------------------------------------------------------------------------
 *
 * - When used together with the plugin 'VE - Dual Wield', place this
 *   plugin above it.
 *
 */
/*:ja
 * @plugindesc v1.02 戦闘中の使用アクションを別スキルに置換できます
 * @author Victor Sant
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/replace-actions/
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
 * アクター、職業、武器、防具、ステートのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <action replace: trigger, X, Y%[, priority]>
 *   アクションを別スキルに置換します。
 *     trigger : 置換スキルを発動させるアクション(下記参照)
 *     X : 使用スキルID
 *     Y : スキルを置換する確率。0から100%
 *     priority : スキルの優先度。数値。任意項目。
 *
 * ---------------
 *
 *  <custom action replace: trigger[, priority]>
 *   result = code
 *  </custom action replace>
 *   スクリプトコードを使用して、攻撃スキルを別スキルに置換します。
 *     code : スキルIDを返すコード
 *     priority : スキルの優先度。数値。任意項目。
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 * コードではダメージ式と同じ値を使っているので、使用者には'a'、
 * 変数には'v[x]'を使うことができます。
 * 'result'は数値を返さなければなりません。
 * 'result'が0(定義されていない)の場合、アクションは置換しません。
 *
 * ---------------
 *
 *  - Trigger
 *  トリガーとして使用できる値は以下です。
 *      skill x   : スキルIDxをアクションに置換
 *      item x    : アイテムIDxをアクションに置換
 *      stype x   : スキルをスキルタイプIDxに置換
 *      itype x   : アイテムをアイテムタイプIDxに置換
 *      element x : アクションを属性IDxに置換
 *      attack    : 通常攻撃を属性IDxに置換
 *      guard     : 防御スキルを置換
 *      physical  : 物理攻撃を置換
 *      magical   : 魔法攻撃を置換
 *      any       : 全てのアクションを置換
 *
 * ---------------
 *
 *  - Priority
 * 優先度は任意の数値で、複数の置換タグが存在する場合、
 * どのアクションを使用するかを決定するために使用されます。
 * 優先度の高いスキルが選択されます。
 * 同じ優先度のスキルが複数存在する場合、IDが最も低いスキルが使用されます。
 *
 * ---------------
 *
 * 元のアクションが全てを対象にしている場合、
 * 置換アクションも全てを対象にします。
 * 元のアクションが単一を対象とし、置換アクションが全てを対象とする場合、
 * アクションは全てを対象とします。
 *
 * アクションの対象範囲を変更しないので、元のアクションが敵を対象にしていても、
 * 置換アクションが味方を対象にしていた場合、
 * アクションは敵を対象にしたままになります。
 *
 * ---------------
 *
 * 元のアクションのコストではなく、置換アクションのコストが使用されます。
 * 代わりにスキルコストが使用されるアイテムにとって非常に重要です。
 *
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 *  <action replace: attack, 9, 100%>
 *
 * ---------------
 *
 *  <action replace: skill 10, 75%, 5>
 *
 * ---------------
 *
 *  <custom action replace: magical>
 *   if (v[10] < 100) {
 *       result = 10;
 *   } else {
 *       result = 0;
 *   }
 *  </custom action replace>
 *
 * ---------------
 *
 *  <custom action replace: guard, 10>
 *   if (a.level < 10) {
 *       result = 11;
 *   } else {
 *       result = 12;
 *   }
 *  </custom action replace>
 *
 * ---------------------------------------------------------------------------
 * 互換性
 * ---------------------------------------------------------------------------
 *
 * - 'V_DualWield'プラグインと併用する場合、
 * このプラグインを上に配置してください。
 *
 */

(function () {

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.ReplaceActions.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.ReplaceActions.loadNotetagsValues.call(this, data, index);
		if (this.objectSelection(index, ['actor', 'class', 'weapon', 'armor', 'enemy', 'state'])) {
			VictorEngine.ReplaceActions.loadNotes(data);
		}
	};

	VictorEngine.ReplaceActions.loadNotes = function (data) {
		data.replaceActions = data.replaceActions || [];
		this.processNotes(data);
	};

	VictorEngine.ReplaceActions.processNotes = function (data, type) {
		var match;
		var part1 = 'action replace'
		var part2 = '[ ]*:[ ]*(physical|magical|attack|guard|item|skill)[ ]*(\\d+)?'
		var part3 = '[ ]*(?:[ ]*,[ ]*(\\d+))?[ ]*'
		var part4 = ',[ ]*(?:skill)?[ ]*(\\d+)[ ]*,[ ]*(\\d+)\\%?'
		var regex1 = new RegExp('<' + part1 + part2 + part4 + part3 + '>', 'gi');
		var regex2 = VictorEngine.getNotesValues('custom ' + part1 + part2 + part3, 'custom ' + part1);
		while ((match = regex1.exec(data.note)) !== null) {
			this.processValues(data, match, type, false);
		};
		while ((match = regex2.exec(data.note)) !== null) {
			this.processValues(data, match, type, true);
		};
	};

	VictorEngine.ReplaceActions.processValues = function (data, match, type, code) {
		var result = {};
		result.type = match[1].toLowerCase();
		result.id = Number(match[2]) || 0;
		result.skill = code ? 0 : Number(match[3]);
		result.rate = code ? 0 : Number(match[4]);
		result.code = code ? match[4].trim() : '';
		result.priority = Number(match[code ? 3 : 5]) || 0;
		data.replaceActions.push(result);
	};

	//=============================================================================
	// BattleManager
	//=============================================================================

	VictorEngine.ReplaceActions.startAction = BattleManager.startAction;
	BattleManager.startAction = function () {
		this.prepaRereplaceAction(this._subject.currentAction());
		VictorEngine.ReplaceActions.startAction.call(this);
	};

	BattleManager.prepaRereplaceAction = function (action) {
		if (action) {
			id = action.subject().replaceAction(action);
			if (this._subject.canUse($dataSkills[id])) {
				action.rereplaceAction(id);
			}
		}
	};

	//=============================================================================
	// Game_Action
	//=============================================================================

	VictorEngine.ReplaceActions.makeTargets = Game_Action.prototype.makeTargets;
	Game_Action.prototype.makeTargets = function () {
		if (this._replaceActionTargets && !(this.subject().isConfused() && this.isForOne())) {
			var targets = this._replaceActionTargets.clone();
			this._replaceActionTargets = null;
			return targets;
		} else {
			this._replaceActionTargets = null;
			return VictorEngine.ReplaceActions.makeTargets.call(this);
		}
	};

	VictorEngine.ReplaceActions.isAttack = Game_Action.prototype.isAttack;
	Game_Action.prototype.isAttack = function () {
		return VictorEngine.ReplaceActions.isAttack.call(this) || this._isAttackReplace;
	};

	VictorEngine.ReplaceActions.isGuard = Game_Action.prototype.isGuard;
	Game_Action.prototype.isGuard = function () {
		return VictorEngine.ReplaceActions.isGuard.call(this) || this._isGuardReplace;
	};

	Game_Action.prototype.rereplaceAction = function (id) {
		var isForOpponent = this.isForOpponent();
		var isForFriend = this.isForFriend();
		var isForUser = this.isForUser();
		var isForAll = this.isForAll();
		this._isAttackReplace = this.isAttack();
		this._isGuardReplace = this.isGuard();
		this.setSkill(id);
		var result = [];
		if (isForFriend && (isForAll || this.isForAll()) && !this.isForDeadFriend()) {
			result = this.subject().friendsUnit().aliveMembers();
		} else if (isForFriend && (isForAll || this.isForAll()) && this.isForDeadFriend()) {
			result = this.subject().friendsUnit().deadMembers();
		} else if (isForOpponent && (isForAll || this.isForAll()) && !this.isForDeadFriend()) {
			result = this.subject().opponentsUnit().aliveMembers();
		} else if (isForOpponent && (isForAll || this.isForAll()) && this.isForDeadFriend()) {
			result = this.subject().opponentsUnit().deadMembers();
		} else if (isForFriend) {
			result = this.targetsForFriends();
		} else if (isForOpponent) {
			result = this.targetsForOpponents();
		} else if (isForUser) {
			result = [this.subject()];
		};
		this._replaceActionTargets = this.repeatTargets(result);
	};

	//=============================================================================
	// Game_Battler
	//=============================================================================

	Game_Battler.prototype.replaceAction = function (action) {
		var object = this;
		var result = this.traitObjects().reduce(function (r, data) {
			return r.concat(object.getReplaceActions(data.replaceActions, action));
		}, []).sort(this.getReplaceActionsPriority.bind(this))[0];
		return this.replaceActionId(result, action);
	};

	Game_Battler.prototype.getReplaceActionsPriority = function (a, b) {
		if (a.priority === b.priority) {
			return a.id - b.id;
		} else {
			return b.priority - a.priority;
		}
	};

	Game_Battler.prototype.getReplaceActions = function (replaceActions, action) {
		return replaceActions.filter(function (data) {
			return this.replaceActionType(data, action) && this.replaceActionRate(data);
		}, this);
	};

	Game_Battler.prototype.replaceActionType = function (data, action) {
		return ((data.type === 'physical' && action.isPhysical()) || (data.type === 'magical' && action.isMagical()) ||
			(data.type === 'attack' && action.isAttack()) || (data.type === 'guard' && action.isGuard()) ||
			(data.type === 'stype' && action.isSkill() && action.item().stypeId === data.id) ||
			(data.type === 'itype' && action.isItem() && action.item().itypeId === data.id) ||
			(data.type === 'skill' && action.isSkill() && action.item().id === data.id) ||
			(data.type === 'item' && action.isItem() && action.item().id === data.id) ||
			(data.type === 'element' && action.item().damage.elementId === data.id) ||
			(data.type === 'any'));
	};

	Game_Battler.prototype.replaceActionRate = function (data) {
		if (data.code) {
			return true;
		} else {
			return Math.random() < data.rate / 100
		}
	};

	Game_Battler.prototype.replaceActionId = function (data, action) {
		if (data && data.code) {
			var result = 0;
			var item = action.item();
			var a = this;
			var v = $gameVariables._data;
			eval(data.code)
			return result || 0;
		} else if (data && data.skill) {
			return data.skill || 0;
		} else {
			return 0;
		}
	};

})();