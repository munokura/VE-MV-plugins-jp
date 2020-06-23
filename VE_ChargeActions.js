/*
 * ==============================================================================
 * ** Victor Engine MV - Charge Actions
 * ------------------------------------------------------------------------------
 * VE_Charge Actions.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Charge Actions'] = '2.03';

var VictorEngine = VictorEngine || {};
VictorEngine.ChargeActions = VictorEngine.ChargeActions || {};

(function () {

    VictorEngine.ChargeActions.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        VictorEngine.ChargeActions.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Charge Actions', 'VE - Basic Module', '1.23');
    };

    VictorEngine.ChargeActions.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function (name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.ChargeActions.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * @plugindesc v2.03 - Charge actions for some turns before using.
 * @author Victor Sant
 *
 * @help 
 * ==============================================================================
 *  Notetags:
 * ==============================================================================
 *
 * ==============================================================================
 *  Charge Action (notetag for Skills and Items)
 * ------------------------------------------------------------------------------
 *  <charge action: state[, animation]>
 *    result = code
 *  </charge action>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Setup an action to have charge turns.
 *    state : Id of the state that represents the charge time.
 *    anim  : animation displayed when start charging. Opitional.
 *    code  : code that will return the number of charge turns.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <charge action: 12>
 *         result = 2
 *        </charge action>
 *
 *        <charge action: 13, 50>
 *         result = 6 - Math.max(Math.sqrt(a.level + 1) / 2, 1)
 *        </charge action>
 * ==============================================================================
 *
 * ==============================================================================
 *  Additional Information:
 * ------------------------------------------------------------------------------
 *
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "v[x]" for variable and "item" for the item object. The 'result'
 *  must return a numeric value.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Charge State
 *  The state that repesents the charge. If this state is somehow removed, the
 *  charge ends. Avoid changing the state removal conditions and restriction. 
 *  Other values can be changed to represent any change on the battler while
 *  charging. The benefits of the state is taken into account when the result
 *  skill is used, sincethe state is removed only after the skill execution.
 * ==============================================================================
 *
 * ==============================================================================
 *  Charge Actions and Battle Motions:
 * ------------------------------------------------------------------------------
 *  To have an action motion sequence for the charge start, you can use the
 *  following action sequence on the skill notes. This sequence will play only 
 *  for the time the charge is started, when the charge ends, it will play the
 *  normal action sequence.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    <action sequence: charge>
 *     # action sequence 
 *    </action sequence>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: 
 *    <action sequence: charge>
 *     motion: user, walk
 *     move: user, forward, 30, 48
 *     wait: user, move
 *     motion: user, spell
 *    </action sequence>
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.01.17 > First release.
 *  v 1.01 - 2016.01.24 > Compatibility with Basic Module 1.09.
 *  v 1.02 - 2016.03.23 > Compatibility with Throwable Objects.
 *  v 2.00 - 2016.05.31 > No longer requires two different skills.
 *  v 2.01 - 2016.06.26 > Compatibility with Battle Motions.
 *  v 2.02 - 2016.08.29 > Compatibility bugfix with Battle Motions.
 *  v 2.03 - 2016.07.20 > Compatibility with Cooperation Skills.
 * =============================================================================
 */
/*:ja
 * @plugindesc v2.03 発動に時間がかかるスキル・アイテムを作成できます
 * @author Victor Sant
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/charge-actions/
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
 *  チャージアクション (スキル、アイテムのメモタグ)
 * ---------------------------------------------------------------------------
 *  <charge action: state[, animation]>
 *    result = code
 *  </charge action>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  チャージターンを持つアクションを設定します。
 *    state      : チャージ中のステートID
 *    animation  : チャージ開始時に表示されるアニメーション。任意設定。
 *    code       : チャージターン数を返すコード
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:
 *    <charge action: 12>
 *     result = 2
 *    </charge action>
 *
 *    <charge action: 13, 50>
 *     result = 6 - Math.max(Math.sqrt(a.level + 1) / 2, 1)
 *    </charge action>
 * ===========================================================================
 *
 * ===========================================================================
 *  追加情報
 * ---------------------------------------------------------------------------
 *
 * コードではダメージ式と同じ値を使用しているので、使用者には'a'、
 * 変数には'v[x]'、アイテムオブジェクトには'item'を使用します。
 * 'result'は数値を返す必要があります。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Charge State
 * チャージを表すステート。
 * このステートが何らかの形で解除されるとチャージは終了します。
 * ステート除去の条件や制限を変更しないようにしましょう。
 * 他の値を変更することで、
 * チャージ中のバトラーの変化を表すことができます。
 * ステートが解除されるのはスキル実行後のみで、
 * スキル実行時にはステートの効果が考慮されます。
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  チャージアクションとバトルモーション
 * ---------------------------------------------------------------------------
 * チャージ開始時のアクションモーションシーケンスを持たせるには、
 * スキルノートに記載されているこのシーケンスはチャージ開始時のみ再生され、
 * チャージ終了時には通常のアクションシーケンスが再生されます。
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    <action sequence: charge>
 *     # action sequence
 *    </action sequence>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:
 *    <action sequence: charge>
 *     motion: user, walk
 *     move: user, forward, 30, 48
 *     wait: user, move
 *     motion: user, spell
 *    </action sequence>
 * ===========================================================================
 *
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2016.01.17 > First release.
 *  v 1.01 - 2016.01.24 > Compatibility with Basic Module 1.09.
 *  v 1.02 - 2016.03.23 > Compatibility with Throwable Objects.
 *  v 2.00 - 2016.05.31 > No longer requires two different skills.
 *  v 2.01 - 2016.06.26 > Compatibility with Battle Motions.
 *  v 2.02 - 2016.08.29 > Compatibility bugfix with Battle Motions.
 *  v 2.03 - 2016.07.20 > Compatibility with Cooperation Skills.
 * ===========================================================================
 */

(function () {

    //=============================================================================
    // Game_Action
    //=============================================================================

    VictorEngine.ChargeActions.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function (data, index) {
        VictorEngine.ChargeActions.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['skill', 'item'])) {
            VictorEngine.ChargeActions.loadNotes(data);
        }
    };

    VictorEngine.ChargeActions.loadNotes = function (data) {
        data.chargeAction = data.chargeAction || {};
        this.processNotes(data);
    };

    VictorEngine.ChargeActions.processNotes = function (data) {
        var match;
        var part1 = 'charge action';
        var part2 = '[ ]*:[ ]*(\\d+)(?:[ ]*,[ ]*(\\d+))?[ ]*'
        var regex = VictorEngine.getNotesValues(part1 + part2, part1);
        while (match = regex.exec(data.note)) {
            data.chargeAction.state = Number(match[1]);
            data.chargeAction.anim = Number(match[2]) || 0;
            data.chargeAction.turns = match[3].trim();
            data.chargeAction.skill = true;
        };
    };

    //=============================================================================
    // BattleManager
    //=============================================================================

    VictorEngine.ChargeActions.processTurn = BattleManager.processTurn;
    BattleManager.processTurn = function () {
        if (this._subject.isChargingAction()) {
            this._subject.updateChargeAction();
        }
        VictorEngine.ChargeActions.processTurn.call(this);
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    Game_Action.prototype.isChargeAction = function () {
        return this.item().chargeAction.skill;
    };

    Game_Action.prototype.chargeActionTurns = function () {
        return this.item().chargeAction.turns;
    };

    Game_Action.prototype.chargeActionState = function () {
        return this.item().chargeAction.state;
    };

    Game_Action.prototype.chargeActionAnimation = function () {
        return this.item().chargeAction.anim;
    };

    //=============================================================================
    // Game_BattlerBase
    //=============================================================================

    VictorEngine.ChargeActions.canInput = Game_BattlerBase.prototype.canInput;
    Game_BattlerBase.prototype.canInput = function () {
        return VictorEngine.ChargeActions.canInput.call(this) && !this.isChargingAction();
    };

    VictorEngine.ChargeActions.refresh = Game_BattlerBase.prototype.refresh;
    Game_BattlerBase.prototype.refresh = function () {
        VictorEngine.ChargeActions.refresh.call(this);
        this.refreshChargeAction();
    };

    Game_BattlerBase.prototype.isChargingAction = function () {
        return !!this._chargeAction;
    };

    Game_BattlerBase.prototype.chargeTimeEnd = function () {
        return this._chargeAction && this._chargeAction.turns < 0;
    };

    Game_BattlerBase.prototype.clearChargeAction = function () {
        if (this._chargeAction) {
            this.eraseState(this._chargeAction.state)
            this._chargeAction = null;
        }
    };

    Game_BattlerBase.prototype.refreshChargeAction = function () {
        if (this._chargeAction && !this.isStateAffected(this._chargeAction.state)) {
            this._chargeAction = null;
        }
    };

    Game_BattlerBase.prototype.setChargeAction = function (action) {
        this._chargeAction = {};
        this._chargeAction.skill = action.item().id;
        this._chargeAction.turns = this.chargeActionTurns(action);
        this._chargeAction.index = action._targetIndex;
        this._chargeAction.state = action.chargeActionState();
        this.addNewState(this._chargeAction.state);
    };

    Game_BattlerBase.prototype.chargeActionTurns = function (action) {
        try {
            var result = 1;
            var item = action.item();
            var a = this;
            var v = $gameVariables._data;
            eval(action.chargeActionTurns())
            return Math.floor(Math.max(Number(result), 1)) || 1;
        } catch (e) {
            return 1;
        }
    };

    Game_BattlerBase.prototype.updateChargeAction = function () {
        if (!this.currentAction()) {
            this._chargeAction.turns--;
        }
        if (this.chargeTimeEnd()) {
            var action = new Game_Action(this);
            action.setSkill(this._chargeAction.skill);
            action._targetIndex = this._chargeAction.index;
            this.setAction(0, action)

        }
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

    VictorEngine.ChargeActions.onRestrict = Game_Battler.prototype.onRestrict;
    Game_Battler.prototype.onRestrict = function () {
        VictorEngine.ChargeActions.onRestrict.call(this)
        this.clearChargeAction();
    };

    VictorEngine.ChargeActions.onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function () {
        VictorEngine.ChargeActions.onBattleEnd.call(this)
        this.clearChargeAction();
    };

    //=============================================================================
    // Window_BattleLog
    //=============================================================================

    VictorEngine.ChargeActions.startAction = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function (subject, action, targets) {
        if (action.isChargeAction() && !subject.isChargingAction()) {
            this.startChargeAction(subject, action, targets)
        } else if (!action.isChargeAction() && subject.isChargingAction()) {
            BattleManager.clearActionTargets();
        } else {
            VictorEngine.ChargeActions.startAction.call(this, subject, action, targets);
        }
    };

    VictorEngine.ChargeActions.endAction = Window_BattleLog.prototype.endAction;
    Window_BattleLog.prototype.endAction = function (subject) {
        if (subject.isChargingAction() && subject.chargeTimeEnd()) {
            subject.clearChargeAction();
        }
        VictorEngine.ChargeActions.endAction.call(this, subject);
    };

    VictorEngine.ChargeActions.performActionStart = Window_BattleLog.prototype.performActionStart;
    Window_BattleLog.prototype.performActionStart = function (subject, action) {
        if (action.isChargeAction() && !subject.isChargingAction() && Imported['VE - Battle Motions']) {
            var index = VictorEngine.battlerIndex(subject);
            var current = this.currentAction(index);
            this.insert(index, 'performMotion', 'charge', subject, action, current.targets);
            this.insert(index, 'performMotion', 'prepare', subject, action, current.targets);
        } else {
            VictorEngine.ChargeActions.performActionStart.call(this, subject, action);
        }
    };

    Window_BattleLog.prototype.startChargeAction = function (subject, action, targets) {
        this.setupCurrentAction(subject, action, targets);
        this.push('performActionStart', subject, action);
        this.push('waitForMovement');
        this.push('showAnimation', subject, [subject], action.chargeActionAnimation());
        this.push('waitForBattleAnimation', action.chargeActionAnimation());
        this.push('performChargeAction', subject, action);
    };

    Window_BattleLog.prototype.performChargeAction = function (subject, action) {
        subject.setChargeAction(action);
        BattleManager.clearActionTargets();
    };

    Window_BattleLog.prototype.defaultMotionCharge = function (subject, action) {
        var motion = '';
        motion += 'motion: user, walk;';
        motion += 'move: user, forward, 30, 48;';
        motion += 'wait: user, move;';
        motion += 'motion: user, spell;';
        return motion;
    };

})();