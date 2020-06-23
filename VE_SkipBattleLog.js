/*
 * ==============================================================================
 * ** Victor Engine MV - Skip Battle Log
 * ------------------------------------------------------------------------------
 * VE_SkipBattleLog.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Skip Battle Log'] = '1.04';

var VictorEngine = VictorEngine || {};
VictorEngine.SkipBattleLog = VictorEngine.SkipBattleLog || {};

(function () {

    VictorEngine.SkipBattleLog.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        VictorEngine.SkipBattleLog.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Skip Battle Log', 'VE - Basic Module', '1.21');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Skip Battle Log', 'VE - Charge Actions');
    };

    VictorEngine.SkipBattleLog.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function (name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.SkipBattleLog.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * @plugindesc v1.04 - Skip Battle Log Window messages.
 * @author Victor Sant
 *
 * @param Skip All Text
 * @desc Skip any battle log text.
 * true - ON	false - OFF
 * @default true
 *
 * @param Action Text
 * @desc Display skill icon and name.
 * true - ON	false - OFF
 * @default true
 *
 * @help 
 * ==============================================================================
 *  Notetags:
 * ==============================================================================
 *
 * ==============================================================================
 *  Throw Image (for Skills and Items)
 * ------------------------------------------------------------------------------
 *  <hide name display>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Usable only if the plugin parameter 'Action Text' is turned ON. This
 *  tag will make the action name to not be displayed when it is used.
 * ==============================================================================
 *
 * ==============================================================================
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  If the plugin parameter "Skip All Text" is turned on, every battle log text
 *  will be skiped. If false, you can define wich texts will be skiped.
 * 
 *  To skip a text if the plugin parameter is off, just leave the text empty on
 *  the database. 
 *  For skills (wich include the basic attack and guard) and states message,
 *  just go to the the skill or state and remove the messages.
 *
 *  For other texts, go to the database 'Terms' tab and remove the texts related
 *  to the battle log. The texts that are displayed on the battlelog are:
 *  - Use Item
 *  - Critical to Enemy
 *  - Critical to Actor
 *  - Actor Damage
 *  - Actor Recovery
 *  - Actor Gain
 *  - Actor Loss
 *  - Actir Drain
 *  - Actor No Damage
 *  - Actor No Hit
 *  - Enemy Damage
 *  - Enemy Recovery
 *  - Enemy Gain
 *  - Enemy Loss
 *  - Enemy Drain
 *  - Enemy No Damage
 *  - Enemy No Hit
 *  - Evasion
 *  - Magic Evasion
 *  - Magic Reflection
 *  - Counter Attack
 *  - Substitute
 *  - Buff Add
 *  - Debuff Add
 *  - Buff Remove
 *  - Action Failure
 *  Other texts are show in other parts besides the Battle Log, so they shoudn't
 *  be removed.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  If the plugin paramenter 'Action Text' is turned on, when using a skill or
 *  item, the item/skill name will be displayed, along with it's icon, insted
 *  of the default skill text set on the database. This text will be displayed
 *  even if the 
 *
 * ==============================================================================
 *  Compatibility:
 * ------------------------------------------------------------------------------
 *  To be used together with this plugin, the following plugin must be placed
 *  bellow this plugin:
 *     VE - Charge Actions
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.01.17 > First release.
 *  v 1.01 - 2016.03.04 > Improved collapse effect timing.
 *  v 1.02 - 2016.03.23 > Compatibility with Throwable Objects.
 *  v 1.03 - 2016.04.21 > Compatibility with Damage Popup.
 *  v 1.04 - 2016.05.31 > Compatibility with Battle Motions.
 * ==============================================================================
 */
/*:ja
 * @plugindesc v1.04 - バトルログウィンドウのメッセージを非表示にします
 * @author Victor Sant
 * 
 * @param Skip All Text
 * @text 全テキストを非表示
 * @type boolean
 * @on 非表示
 * @off 表示
 * @desc バトルログのテキストを非表示
 * 非表示:true / 表示:false
 * @default true
 * 
 * @param Action Text
 * @text アクションテキスト表示
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc スキルアイコンと名前を表示
 * 表示:true / 非表示:false
 * @default true
 * 
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 * 
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/skip-battle-log/
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
 *  非表示(スキル・アイテム用)
 * ---------------------------------------------------------------------------
 *  <hide name display>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * プラグインのパラメータ'Action Text'がONになっている場合のみ使用可能です。
 * このタグを使用すると、アクション名を表示しないようにします。
 * ===========================================================================
 * 
 * ===========================================================================
 * 追加情報
 * ---------------------------------------------------------------------------
 * 
 * プラグインパラメータ'Skip All Text'がオンになっている場合、
 * 全てのバトルログテキストが非表示になります。
 * falseの場合、どのテキストを非表示にするか設定できます。
 * 
 * プラグインのパラメータがオフの場合、テキストを非表示にするには、
 * データベース上にテキストを空のままにしておきます。
 * スキル(通常攻撃と防御を含む)とステートのメッセージについては、
 * そのスキルかステートでメッセージを削除してください。
 * 
 * その他のテキストについては、データベースの'用語'タブに移動し、
 * バトルログに関連するメッセージを削除してください。
 * バトルログに表示されるメッセージ項目は以下の通りです。
 *  - アイテム使用
 *  - 敵に会心
 *  - 味方に会心
 *  - 味方ダメージ
 *  - 味方回復
 *  - 味方ポイント増加
 *  - 味方ポイント減少
 *  - 味方ポイント吸収
 *  - 味方ノーダメージ
 *  - 味方に命中せず
 *  - 敵ダメージ
 *  - 敵回復
 *  - 敵ポイント増加
 *  - 敵ポイント減少
 *  - 敵ポイント吸収
 *  - 敵ノーダメージ
 *  - 敵に命中せず
 *  - 回避
 *  - 魔法回避
 *  - 魔法反射
 *  - 反撃
 *  - 身代わり
 *  - 強化
 *  - 弱体
 *  - 強化・弱体の解除
 *  - 行動失敗
 * 他のテキストはバトルログ以外の部分にも表示されているので、
 * 削除してはいけません。
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 * プラグインのパラメータ'Action Text'を有効にすると、
 * スキルやアイテムを使用する際に、
 * データベース上のデフォルトのスキルテキストの他に、
 * アイテム/スキル名とそのアイコンが表示されます。
 * 
 * ===========================================================================
 *  互換性
 * ---------------------------------------------------------------------------
 * 本プラグインと併用するためには、
 * 以下のプラグインを本プラグインの下に配置する必要があります。
 *     VE - Charge Actions
 * ===========================================================================
 * 
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2016.01.17 > First release.
 *  v 1.01 - 2016.03.04 > Improved collapse effect timing.
 *  v 1.02 - 2016.03.23 > Compatibility with Throwable Objects.
 *  v 1.03 - 2016.04.21 > Compatibility with Damage Popup.
 *  v 1.04 - 2016.05.31 > Compatibility with Battle Motions.
 * ===========================================================================
 */

(function () {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.SkipBattleLog = {};
        VictorEngine.Parameters.SkipBattleLog.SkipAllText = eval(parameters["Skip All Text"]);
        VictorEngine.Parameters.SkipBattleLog.ActionText = eval(parameters["Action Text"]);
    };

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.SkipBattleLog.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function (data, index) {
        VictorEngine.SkipBattleLog.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['skill', 'item'])) {
            VictorEngine.SkipBattleLog.loadNotes(data);
        }
    };

    VictorEngine.SkipBattleLog.loadNotes = function (data) {
        var match;
        var regex = new RegExp('<hide name display>', 'gi');
        while (match = regex.exec(data.note)) {
            data.hideNameDisplay = true;
        };
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    VictorEngine.SkipBattleLog.apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        this.subject()._skipClearResult = true;
        VictorEngine.SkipBattleLog.apply.call(this, target);
        this.subject()._skipClearResult = false;
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

    VictorEngine.SkipBattleLog.clearResult = Game_Battler.prototype.clearResult;
    Game_Battler.prototype.clearResult = function () {
        if (!this._skipClearResult) {
            VictorEngine.SkipBattleLog.clearResult.call(this);
        }
    };

    //=============================================================================
    // Window_BattleLog
    //=============================================================================

    /* Overwritten function */
    Window_BattleLog.prototype.isFastForward = function () {
        return false;
    };

    /* Overwritten function */
    Window_BattleLog.prototype.animationBaseDelay = function () {
        return 0;
    };

    /* Overwritten function */
    Window_BattleLog.prototype.animationNextDelay = function () {
        return 0;
    };

    VictorEngine.SkipBattleLog.initialize = Window_BattleLog.prototype.initialize;
    Window_BattleLog.prototype.initialize = function () {
        this.initializeMethodsStack()
        VictorEngine.SkipBattleLog.initialize.call(this);
    };

    VictorEngine.SkipBattleLog.updateWaitMode = Window_BattleLog.prototype.updateWaitMode;
    Window_BattleLog.prototype.updateWaitMode = function () {
        if (this._waitMode === 'effect' && !$gameTroop.isAllDead()) {
            this._waitMode = '';
        }
        return VictorEngine.SkipBattleLog.updateWaitMode.call(this);
    };

    VictorEngine.SkipBattleLog.addText = Window_BattleLog.prototype.addText;
    Window_BattleLog.prototype.addText = function (text) {
        if (text !== "" && !VictorEngine.Parameters.SkipBattleLog.SkipAllText) {
            VictorEngine.SkipBattleLog.addText.call(this, text);
        }
    };

    VictorEngine.SkipBattleLog.drawLineText = Window_BattleLog.prototype.drawLineText;
    Window_BattleLog.prototype.drawLineText = function (index) {
        var item = this._lines[index];
        if (DataManager.isItem(item) || DataManager.isSkill(item)) {
            var rect = this.itemRectForText(index);
            var width = this.textWidth(item.name + Window_Base._iconWidth + 4);
            this.drawItemName(item, rect.width / 2 - width / 2, rect.y);
        } else {
            VictorEngine.SkipBattleLog.drawLineText.call(this, index);
        }
    };

    VictorEngine.SkipBattleLog.displayAction = Window_BattleLog.prototype.displayAction;
    Window_BattleLog.prototype.displayAction = function (subject, item) {
        if (VictorEngine.Parameters.SkipBattleLog.ActionText) {
            if (!item.hideNameDisplay) {
                this.push('pushBaseLine');
                this.push('addItemText', item);
                this.push('popBaseLine');
            } else {
                this.push('wait');
            }
        } else {
            VictorEngine.SkipBattleLog.displayAction.call(this, subject, item);
        }
    };

    VictorEngine.SkipBattleLog.startAction = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function (subject, action, targets) {
        VictorEngine.SkipBattleLog.startAction.call(this, subject, action, targets);
        this.setupStartAction(subject, action, targets);
    };

    VictorEngine.SkipBattleLog.push = Window_BattleLog.prototype.push;
    Window_BattleLog.prototype.push = function (methodName) {
        if (this._stackIndex || this.methodStackActive()) {
            this.pushMethodsStack.apply(this, arguments);
        } else {
            VictorEngine.SkipBattleLog.push.apply(this, arguments);
        }
    };

    VictorEngine.SkipBattleLog.update = Window_BattleLog.prototype.update;
    Window_BattleLog.prototype.update = function () {
        if (this.methodStackActive() && !Imported['VE - Battle Motions']) {
            this.updateMethodsStack();
        } else {
            VictorEngine.SkipBattleLog.update.call(this);
        }
    };

    VictorEngine.SkipBattleLog.isBusy = Window_BattleLog.prototype.isBusy;
    Window_BattleLog.prototype.isBusy = function () {
        return VictorEngine.SkipBattleLog.isBusy.call(this) || this.methodStackActive();
    };

    VictorEngine.SkipBattleLog.updateWait = Window_BattleLog.prototype.updateWait;
    Window_BattleLog.prototype.updateWait = function () {
        return VictorEngine.SkipBattleLog.updateWait.call(this) || this.methodStackActive();
    };

    VictorEngine.SkipBattleLog.updateStackWaitMode = Window_BattleLog.prototype.updateStackWaitMode;
    Window_BattleLog.prototype.updateStackWaitMode = function (index) {
        var waitMode = this._stackWaitMode[index];
        if (waitMode && waitMode.contains('effect') && !$gameTroop.isAllDead()) {
            this.removeWaitMode(index, 'effect');
        }
        return VictorEngine.SkipBattleLog.updateStackWaitMode.call(this, index);
    };

    Window_BattleLog.prototype.addItemText = function (item) {
        this._lines.push(item);
        this.refresh();
        this.wait();
    };

})();