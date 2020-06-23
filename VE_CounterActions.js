/*
 * ==============================================================================
 * ** Victor Engine MV - Counter Actions
 * ------------------------------------------------------------------------------
 *  VE_CounterActions.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Counter Actions'] = '1.10';

var VictorEngine = VictorEngine || {};
VictorEngine.CounterActions = VictorEngine.CounterActions || {};

(function () {

    VictorEngine.CounterActions.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        VictorEngine.CounterActions.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Counter Actions', 'VE - Basic Module', '1.21');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Counter Actions', 'VE - Retaliation Damage');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Counter Actions', 'VE - FollowUp Skills');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Counter Actions', 'VE - Damage Popup');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Counter Actions', 'VE - Dual Wield');
    };

    VictorEngine.CounterActions.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function (name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.CounterActions.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * @plugindesc v1.10 - Skills and items to be used as counter attacks.
 * @author Victor Sant
 *
 * @param Counter Animation
 * @desc ID of the animation displayed when a action is countered.
 * Default: 0. (No animation)
 * @default 0
 *
 * @help 
 * ==============================================================================
 *  Notetags:
 * ==============================================================================
 *
 * ==============================================================================
 *  Action Counter (for Actors, Classes, Enemies, Weapons, Armors and States) 
 * ------------------------------------------------------------------------------
 *  <action counter: trigger, action, rate[, priority]>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Setup a custom counter effect. 
 *    trigger  : the action that will trigger the counter. (see below)
 *    action   : the action that will be used as counter. (see below)
 *    rate     : chance of triggering. 0-100.
 *    priority : counter action priority. (see below)
 * ==============================================================================
 *
 * ==============================================================================
 *  Custom Action Counter (for Actors, Classes, Enemies, Weapons, Armors, States) 
 * ------------------------------------------------------------------------------
 *  <custom action counter: trigger, action[, priority]>
 *   result = code
 *  </custom action counter>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Process a script code to setup a custom counter effect. 
 *    trigger  : the action that will trigger the counter. (see below)
 *    action   : the action that will be used as counter. (see below)
 *    priority : counter action priority. (see below)
 *    code     : code that will return the rate value.
 * ==============================================================================
 *
 * ==============================================================================
 *  Ignore Counters (for Skills and Items Notetags) 
 * ------------------------------------------------------------------------------
 *  <ignore counter>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *   The action will always bypass any custom counter the target have.
 * ==============================================================================
 *
 * ==============================================================================
 *  Additional Information:
 * ------------------------------------------------------------------------------
 *
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "b" for the target, "v[x]" for variable and "item" for the item
 *  object. The 'result' must return a numeric value between 0 and 100. (values
 *  outside of this range are redundant)
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  - Counter Triggers
 *  The trigger must be one of the following values can be used as triggers.
 *      skill x   : Counter when hit by the skill Id X.
 *      item x    : Counter when hit by the item Id X.
 *      stype x   : Counter when hit by skills with skill type Id X.
 *      itype x   : Counter when hit by items with item type Id X.
 *      element x : Counter when hit by actions with element Id X.
 *      attack    : Counter when hit by the basic attack.
 *      physical  : Counter when hit by physical damage.
 *      magical   : Counter when hit by magical damage.
 *      damage    : Counter when hit by any damage.
 *      any       : Counter when hit by any action.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Counter Actions
 *   The action must be one of the following values can be used as actions.
 *      attack  : Counter with the basic attack.
 *      guard   : Counter with the guard action.
 *      skill X : Counter with the skill Id X.
 *      item X  : Counter with the item Id X.
 *      event X : Counter calling the common event Id X (no action is used).
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Counter Priority 
 *  The priority is a opitional arbitrary value, this defines wich skill will 
 *  have priority when multiple different actions are usable as a counter.
 *  The ones with higher priority will go first. If several actions have the
 *  same priority, the one with highest ID will be used.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  Each counter source is calculated separatedely. So if you have two effects
 *  that gives 50% counter, you will not have 100% counter, even if those sources
 *  have exactly the same setup.
 *
 *  The counter action must be still usable and the costs are still consumed.
 *  Enemies can't use items.
 *
 *  By default even allies actions can be countered, to avoid that you can use
 *  functcion 'a.isOpponentOf(b)' on the rate code.
 *
 * ==============================================================================
 *
 * ==============================================================================
 *  Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *   <action counter: physical, attack, 20%>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *   <action counter: damage, item 1, 50%, 10>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *   <action counter: skill 1, item 3, 25%>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *   <action counter: element 1, guard, 30%>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *   <custom action counter: stype 1, skill 3>
 *    result = a.level;
 *   </custom action counter>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *   <custom action counter code: any, attack>
 *    result = a.isOpponent(b) ? 50 : 0;
 *   </custom action counter>
 * 
 * ==============================================================================
 *
 * ==============================================================================
 *  Compatibility:
 * ------------------------------------------------------------------------------
 *  To be used together with this plugin, the following plugins must be placed
 *  bellow this plugin:
 *     VE - Retaliation Damage
 *     VE - FollowUp Skills
 *     VE - Damage Popup
 *     VE - Dual Wield
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2015.12.04 > First release.
 *  v 1.01 - 2015.12.07 > Compatibility with VE - Retaliation Damage.
 *                      > Addeded counter animation.
 *  v 1.02 - 2015.12.21 > Compatibility with Basic Module 1.04.
 *  v 1.03 - 2015.12.26 > Fixed issue with item counter.
 *  v 1.04 - 2016.01.20 > Compatibility with Basic Module 1.08.
 *  v 1.05 - 2016.01.24 > Compatibility with Basic Module 1.09.
 *  v 1.06 - 2016.03.04 > Improved code for better handling script codes.
 *  v 1.07 - 2016.03.15 > Added common event counter.
 *                      > Added ignore counter notetag.
 *                      > Compatibility with YEP_BattleEngineCore.
 *  v 1.08 - 2016.03.18 > Compatibility with Dual Wield.
 *  v 1.09 - 2016.03.23 > Fixed issue with counters not working without the
 *                        plugin Retaliation Damage.
 *  v 1.10 - 2016.05.31 > Compatibility with Battle Motions.
 * ==============================================================================
 */
/*:ja
 * @plugindesc v1.10 反撃に様々なカスタマイズができます
 * @author Victor Sant
 *
 * @param Counter Animation
 * @text 反撃アニメーション
 * @type animation
 * @require 1
 * @desc アクションが反撃された時の表示アニメーションID
 * デフォルト: 0 (アニメーションなし)
 * @default 0
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/counter-actions/
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
 * ===========================================================================
 *  メモタグ
 * ===========================================================================
 *
 * ===========================================================================
 *  反撃 (アクター・職業・敵キャラ・武器・防具・ステート)
 * ---------------------------------------------------------------------------
 *  <action counter: trigger, action, rate[, priority]>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  カスタム反撃効果を設定します。
 *    trigger  : 反撃のトリガーとなるアクション (後述)
 *    action   : 反撃として使用されるアクション (後述)
 *    rate     : 発動確率 0-100
 *    priority : 反撃の優先度 (後述)
 * ===========================================================================
 *
 * ===========================================================================
 *  カスタム反撃 (アクター・職業・敵キャラ・武器・防具・ステート)
 * ---------------------------------------------------------------------------
 *  <custom action counter: trigger, action[, priority]>
 *   result = code
 *  </custom action counter>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  カスタム 反撃効果を設定するためのスクリプト コードを処理します。
 *    trigger  : 反撃のトリガーとなるアクション (後述)
 *    action   : 反撃として使用されるアクション (後述)
 *    priority : 反撃の優先度 (後述)
 *    code     : 発動確率を返すコード
 * ===========================================================================
 *
 * ===========================================================================
 *  反撃を無視 (スキル、アイテムのメモタグ)
 * ---------------------------------------------------------------------------
 *  <ignore counter>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   このアクションは常に対象が持っているカスタム反撃を無視します。
 * ===========================================================================
 *
 * ===========================================================================
 *  追加情報
 * ---------------------------------------------------------------------------
 *
 * コードではダメージ式と同じ値を使っているので、使用者には'a'、対象には'b'、
 * 変数には'v[x]'、アイテムオブジェクトには'item'を使います。
 * 結果'は0から100までの数値を返す必要があります。
 * (この範囲外の値は冗長です)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  - Counter Triggers
 *  トリガーとして使用できる値は以下のいずれかです。
 *      skill x   : スキルIDx使用時に反撃
 *      item x    : アイテムIDx使用時に反撃
 *      stype x   : スキルタイプIDx使用時に反撃
 *      itype x   : アイテムタイプIDx使用時に反撃
 *      element x : 属性IDxのアクション使用時に反撃
 *      attack    : 通常攻撃を使用時に反撃
 *      guard     : 防御使用時に反撃
 *      physical  : 物理スキル使用時に反撃
 *      magical   : 魔法スキル使用時に反撃
 *      damage    : 何らかのダメージを受けた時に反撃
 *      any       : 全アクション使用時に反撃
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Counter Actions
 *   アクションとして使用できる値は以下のいずれかです。
 *      attack  : 基本攻撃で反撃
 *      guard   : 防御で反撃
 *      skill X : スキルIDxで反撃
 *      item X  : アイテムIDxで反撃
 *      event X : コモンイベントIDxを実行で反撃(アクションは使用しない)
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Counter Priority
 * 優先度は任意の値で、複数の異なるアクションが反撃として使用可能な場合、
 * どのスキルが優先されるかを定義します。
 * 優先度の高いものが優先されます。
 * 複数のアクションが同じ優先度を持っている場合、
 * 最も高いIDを持つものが使用されます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * 各反撃ソースは分離して計算されます。
 * 50%の反撃を与える2つのエフェクトがある場合、
 * それらのソースが全く同じ設定であっても、100%の反撃を持つことはありません。
 *
 * 反撃アクションは使える状態の必要があり、コストは消費されます。
 * 敵はアイテムを使用できません。
 *
 * デフォルトでは味方のアクションも反撃されることがありますが、
 * それを避けるために発動率コードに'a.isOpponentOf(b)'を使用できます。
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  メモタグの例
 * ---------------------------------------------------------------------------
 *
 *   <action counter: physical, attack, 20%>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   <action counter: damage, item 1, 50%, 10>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   <action counter: skill 1, item 3, 25%>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   <action counter: element 1, guard, 30%>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   <custom action counter: stype 1, skill 3>
 *    result = a.level;
 *   </custom action counter>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *   <custom action counter code: any, attack>
 *    result = a.isOpponent(b) ? 50 : 0;
 *   </custom action counter>
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  互換性
 * ---------------------------------------------------------------------------
 * このプラグインと一緒に使用する場合、
 * 以下のプラグインは、このプラグインの下に配置する必要があります。
 *     VE - Retaliation Damage
 *     VE - FollowUp Skills
 *     VE - Damage Popup
 *     VE - Dual Wield
 * ===========================================================================
 *
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2015.12.04 > First release.
 *  v 1.01 - 2015.12.07 > Compatibility with VE - Retaliation Damage.
 *                      > Addeded counter animation.
 *  v 1.02 - 2015.12.21 > Compatibility with Basic Module 1.04.
 *  v 1.03 - 2015.12.26 > Fixed issue with item counter.
 *  v 1.04 - 2016.01.20 > Compatibility with Basic Module 1.08.
 *  v 1.05 - 2016.01.24 > Compatibility with Basic Module 1.09.
 *  v 1.06 - 2016.03.04 > Improved code for better handling script codes.
 *  v 1.07 - 2016.03.15 > Added common event counter.
 *                      > Added ignore counter notetag.
 *                      > Compatibility with YEP_BattleEngineCore.
 *  v 1.08 - 2016.03.18 > Compatibility with Dual Wield.
 *  v 1.09 - 2016.03.23 > Fixed issue with counters not working without the
 *                        plugin Retaliation Damage.
 *  v 1.10 - 2016.05.31 > Compatibility with Battle Motions.
 * ===========================================================================
 */

(function () {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.CounterActions = {};
        VictorEngine.Parameters.CounterActions.CounterAnimation = Number(parameters["Counter Animation"]) || 0;
    };

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.CounterActions.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function (data, index) {
        VictorEngine.CounterActions.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['actor', 'class', 'enemy', 'weapon', 'armor', 'state'])) {
            VictorEngine.CounterActions.loadNotes(data);
        }
        if (this.objectSelection(index, ['skill', 'item'])) {
            VictorEngine.CounterActions.loadNotesActions(data);
        }
    };

    VictorEngine.CounterActions.loadNotes = function (data) {
        data.counterActions = data.counterActions || [];
        this.processNotes(data);
    };

    VictorEngine.CounterActions.loadNotesActions = function (data) {
        data.ignoreCounter = !!data.note.match(/<ignore counter>/i)
    };

    VictorEngine.CounterActions.processNotes = function (data) {
        var match;
        var part1 = 'action counter';
        var part2 = '[ ]*:[ ]*(\\w+)[ ]*(\\d+)?[ ]*,[ ]*(\\w+)[ ]*(\\d+)?';
        var part3 = '(?:[ ]*,[ ]*(\\d+))?';
        var regex1 = new RegExp('<' + part1 + part2 + '[ ]*,[ ]*(\\d+)[%]?' + part3 + '[ ]*>', 'gi');
        var regex2 = VictorEngine.getNotesValues('custom ' + part1 + part2 + part3, 'custom ' + part1);
        while (match = regex1.exec(data.note)) {
            this.processValues(match, data, false);
        };
        while (match = regex2.exec(data.note)) {
            this.processValues(match, data, true);
        };
    };

    VictorEngine.CounterActions.processValues = function (match, data, code) {
        var result = {};
        result.type = match[1].toLowerCase();
        result.typeId = Number(match[2]) || 0;
        result.action = match[3].toLowerCase();
        result.actionId = Number(match[4]) || 0;
        result.rate = code ? 0 : Number(match[5]) || 0;
        result.code = code ? String(match[6]).trim() : '';
        result.priority = Number(match[code ? 5 : 6]) || 0;
        data.counterActions.push(result);
    };

    //=============================================================================
    // BattleManager
    //=============================================================================

    /* Overwritten function */
    BattleManager.invokeCounterAttack = function (subject, target) {
        if (!target.isCounterAttack()) {
            var action = {
                subject: target,
                target: subject,
                action: target.counterAction()
            };
            this._counterActions.push(action);
            target.startCounterAttack();
            target.clearCounterAction();
        };
    };

    VictorEngine.CounterActions.initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function () {
        VictorEngine.CounterActions.initMembers.call(this);
        this._counterActions = [];
    };

    VictorEngine.CounterActions.endAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        if (this._counterActions.length > 0 && !this._counterSubject) {
            var counter = this._counterActions.shift();
            this.prepareCounterAction(counter.subject, counter.target, counter.action);
        } else if (this._counterSubject) {
            this.endCounterSubject();
        } else {
            VictorEngine.CounterActions.endAction.call(this);
        }
    };

    BattleManager.prepareCounterAction = function (subject, target, counter) {
        if (counter.action === 'event') {
            this.startEventCounter(subject, target, counter.actionId)
        } else {
            var action = this.setupCounterAction(subject, counter);
            this.startCounterAction(subject, target, action);
        }
    };

    BattleManager.startCounterAction = function (subject, target, action) {
        var targets = action.counterActionTargets(target);
        if (targets.length > 0) {
            this._isCounterAttack = true;
            this._counterSubject = subject;
            this._counterTarget = target;
            this._subject = subject;
            action.setCounterActionTargets(targets);
            action.setCounterAction();
            subject.addNewAction(action);
            this._phase = 'turn';
        }
    };

    BattleManager.startEventCounter = function (subject, target, eventId) {
        this._isCounterAttack = true;
        this._counterSubject = subject;
        this._counterTarget = target;
        this._subject = subject;
        $gameTemp.reserveCommonEvent(eventId);
        this._logWindow.push('clear');
        this.updateEventMain();
    };

    BattleManager.endCounterSubject = function () {
        this._isCounterAttack = false;
        this._logWindow.endAction(this._counterSubject);
        this._counterSubject.endCounterAttack();
        this._subject = this._counterTarget;
        this._counterSubject = null;
        this._counterTarget = null;
    };

    BattleManager.isCounterAttack = function () {
        return this._isCounterAttack;
    };

    BattleManager.setupCounterAction = function (target, counter) {
        action = new Game_Action(target);
        if (counter.action === 'item') {
            action.setItem(counter.actionId);
        } else if (counter.action === 'attack') {
            action.setAttack();
        } else if (counter.action === 'guard') {
            action.setGuard();
        } else {
            action.setSkill(counter.actionId);
        };
        return action
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    VictorEngine.CounterActions.makeTargets = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function () {
        if (this._counterActionTargets) {
            return this._counterActionTargets;
        } else {
            return VictorEngine.CounterActions.makeTargets.call(this);
        }
    };

    VictorEngine.CounterActions.itemCnt = Game_Action.prototype.itemCnt;
    Game_Action.prototype.itemCnt = function (target) {
        if (BattleManager.isCounterAttack() || target === this.subject()) {
            return 0;
        } else if (this.checkCounterAction(target)) {
            return 1;
        } else {
            return VictorEngine.CounterActions.itemCnt.call(this, target);
        };
    };

    Game_Action.prototype.counterActionTargets = function (target) {
        var result = [];
        if (target.isActor()) {
            this._targetIndex = $gameParty.members().indexOf(target);
        } else {
            this._targetIndex = target.index();
        }
        if (this.isForUser() || (this.isForFriend() && this.isForOne())) {
            result = [this.subject()];
        } else if (this.isForFriend() && this.isForAll() && !this.isForDeadFriend()) {
            result = this.subject().friendsUnit().aliveMembers();
        } else if (this.isForFriend() && this.isForAll() && this.isForDeadFriend()) {
            result = this.subject().friendsUnit().deadCounterMembers();
        } else if (this.isForOpponent() && this.isForAll()) {
            result = this.subject().opponentsUnit().aliveMembers();
        } else if (this.isForOpponent() && target.isAlive()) {
            result = [target];
        };
        return this.repeatTargets(result);
    };

    Game_Action.prototype.setCounterActionTargets = function (targets) {
        this._counterActionTargets = targets.clone();
    };

    Game_Action.prototype.checkCounterAction = function (target) {
        if ($gameParty.inBattle()) {
            target.setCounterAction(this.counterActions(target));
            return !!target.counterAction();
        } else {
            return false
        }
    };

    Game_Action.prototype.counterActions = function (target) {
        var list = this.counterActionsData(target);
        return list.filter(function (data) {
            return this.processCounterActions(data, target);
        }, this).sort(this.counterActionsSort.bind(this))[0];
    };

    Game_Action.prototype.counterActionsSort = function (a, b) {
        if (a.priority === b.priority) {
            return b.id - a.id;
        } else {
            return b.priority - a.priority;
        }
    };

    Game_Action.prototype.processCounterActions = function (data, target) {
        var isMiss = Imported['VE - Retaliation Damage'] && !target.result().isHit();
        if (!data || (target.isEnemy() && data.action === 'item') || isMiss) {
            return false;
        }
        if (this.counterType(data, this.item())) {
            return this.processCounterActionsSuccess(data, target);
        } else {
            return false;
        };
    };

    Game_Action.prototype.counterType = function (data, item) {
        return (data.type === 'skill' && this.isSkill() && item.id === data.typeId) ||
            (data.type === 'item' && this.isItem() && item.id === data.typeId) ||
            (data.type === 'stype' && this.isSkill() && item.stypeId === data.typeId) ||
            (data.type === 'itype' && this.isItem() && item.itypeId === data.typeId) ||
            (data.type === 'element' && item.damage.elementId === data.typeId) ||
            (data.type === 'physical' && this.isPhysical()) ||
            (data.type === 'magical' && this.isMagical()) ||
            (data.type === 'attack' && this.isAttack()) ||
            (data.type === 'damage' && ![3, 4].contains(item.damage.type)) ||
            (data.type === 'any');
    };

    Game_Action.prototype.processCounterActionsSuccess = function (data, target) {
        var item = $dataItems[data.actionId];
        var skill = $dataSkills[data.actionId];
        if ((this.item().ignoreCounter) || (data.action === 'item' && !target.canUse(item)) ||
            (data.action === 'skill' && !target.canUse(skill))) {
            return false;
        }
        if (data.rate) {
            return Math.random() < data.rate / 100;
        }
        if (data.code) {
            return Math.random() < this.counterActionsCode(data, target);
        }
        return false;
    };

    Game_Action.prototype.counterActionsCode = function (data, target) {
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

    Game_Action.prototype.counterActionsData = function (target) {
        return target.traitObjects().reduce(function (r, data) {
            return r.concat(data.counterActions);
        }, []);
    };

    Game_Action.prototype.setCounterAction = function () {
        return this._isCounterAction = true;
    };

    Game_Action.prototype.isCounterAction = function () {
        return this._isCounterAction;
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

    Game_Battler.prototype.counterAction = function () {
        return this._counterAction;
    };

    Game_Battler.prototype.setCounterAction = function (action) {
        this._counterAction = action;
    };

    Game_Battler.prototype.clearCounterAction = function () {
        this._counterAction = undefined;
    };

    //=============================================================================
    // Window_BattleLog
    //=============================================================================

    VictorEngine.CounterActions.startAction = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function (subject, action, targets) {
        if (action.isCounterAction()) {
            this.startCounterAction(subject, action, targets);
        }
        VictorEngine.CounterActions.startAction.call(this, subject, action, targets);
    };

    Window_BattleLog.prototype.startCounterAction = function (subject, action, targets) {
        var text = TextManager.counterAttack.format(subject.name())
        if (text) {
            this.push('addText', text);
        }
        var animation = VictorEngine.Parameters.CounterActions.CounterAnimation;
        if (animation > 0) {
            this.push('showAnimation', subject, [subject], animation);
            this.push('waitForBattleAnimation', animation);
        }
    };

})();