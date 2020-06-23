/*
 * ==============================================================================
 * ** Victor Engine MV - Battle Advantage
 * ------------------------------------------------------------------------------
 *  VE_BattleAdvantage.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Battle Advantage'] = '1.03';

var VictorEngine = VictorEngine || {};
VictorEngine.BattleAdvantage = VictorEngine.BattleAdvantage || {};

(function () {

    VictorEngine.BattleAdvantage.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        VictorEngine.BattleAdvantage.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Advantage', 'VE - Basic Module', '1.21');
    };

    VictorEngine.BattleAdvantage.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function (name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.BattleAdvantage.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * @plugindesc v1.03 - Improved surprise/preemptive attacks.
 * @author Victor Sant
 *
 * @param == Advantage Rates ==
 * @default ==============================
 *
 * @param Pre Emptive Formula
 * @desc Formula to decide pre-emptive rate.
 * Leave empty to use default method. (see details bellow)
 * @default @@
 *
 * @param Surprise Formula
 * @desc Formula to decide surpise rate.
 * Leave empty to use default method. (see details bellow)
 * @default @@
 *
 * @param Sneak Attack Formula
 * @desc Formula to decide sneak attack rate.
 * Leave empty for no sneak attack. (see details bellow)
 * @default a.agility() > b.agility() ? 50 : 30
 *
 * @param Back Attack Formula
 * @desc Formula to decide back attack rate.
 * Leave empty for no back attack. (see details bellow)
 * @default a.agility() > b.agility() ? 30 : 50
 *
 * @param Pincer Attack Formula
 * @desc Formula to decide pincer attack rate.
 * Leave empty for no pincer attack. (see details bellow)
 * @default a.agility() > b.agility() ? 50 : 30
 *
 * @param Surrounded Formula
 * @desc Formula to decide surrounded rate.
 * Leave empty for no surrounded. (see details bellow)
 * @default a.agility() > b.agility() ? 30 : 50
 *
 * @param == Advantage Texts ==
 * @default ==============================
 *
 * @param Sneak Attack Message
 * @desc Message displayed when starting a sneak attack.
 * %1 = party's name.
 * @default %1 attacks from behind!
 *
 * @param Back Attack Message
 * @desc Message displayed when being attacked from behind.
 * %1 = party's name.
 * @default %1 is being attacked from behind!
 *
 * @param Pincer Attack Message
 * @desc Message displayed when starting a pincer attack.
 * %1 = party's name.
 * @default %1 attacks from both sides!
 *
 * @param Surrounded Message
 * @desc Message displayed when being surrounded.
 * %1 = party's name.
 * @default %1 is surrounded!
 *
 * @param == Behind Damage ==
 * @default ==============================
 *
 * @param Behind Damage
 * @desc Aditional damage rate when being attacked from behind.
 * Number.	100 = double damage	50 = +50% damage.
 * @default 100
 *
 * @help 
 * ==============================================================================
 *  Notetags:
 * ==============================================================================
 *
 * ==============================================================================
 * No Beind Damage (for Actors, Classes, Enemies, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <no behind damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  A battler with this tag will not receive increased damage when being
 *  attacked from behind.
 * ==============================================================================
 *
 * ==============================================================================
 * No Turn Around (for Actors, Classes, Enemies, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <no turn around>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  A battler with this tag will not change it's default direction, regardless
 *  of it's position.
 * ==============================================================================
 *
 * ==============================================================================
 * No Beind Damage (for Skills and Items)
 * ------------------------------------------------------------------------------
 *  <no behind damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  The battler will not deal increased damage with an action with this tag
 *  even when attacking from behind.
 * ==============================================================================
 *
 * ==============================================================================
 *  Plugin Commands
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  ChanceOfAdvantage
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  The next battle will have a chance of having an advantage. Battles called
 *  by events, by default, don't have chances of advantage occuring.
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  ForceAdvantage PreEmptive
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  The next battle fought will be automatically a pre-emptive attack.
 *  (The party have a free turn)
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  ForceAdvantage Surprise
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  The next battle fought will be automatically a surprise attack.
 *  (The enemies have a free turn)
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  ForceAdvantage SneakAttack
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  The next battle fought will be automatically a sneak attack.
 *  (The party have a free turn, enemies are turned back)
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  ForceAdvantage BackAttack
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  The next battle fought will be automatically a back  attack.
 *  (The enemies have a free turn, party members are turned back)
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  ForceAdvantage PincerAttack
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  The next battle fought will be automatically a pincer attack.
 *  (The party have a free turn, enemies are surrounded)
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  ForceAdvantage Surrounded
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  The next battle fought will be automatically a surrounded attack.
 *  (The enemies have a free turn, party members are surrounded)
 * ==============================================================================
 * 
 * ==============================================================================
 *  Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  - The advantage formulas:
 *  The formula defines the rates of each one of the battle advantage effect to
 *  happen. It must return a numeric value. you can use "a" to refer to the actor
 *  party, "b" to refer to the enemy troop and v[x] for variables. The formula is
 *  evaluated, so any valid js code can be also used.
 *
 *  you can user "a.agility()" to get the party average agility and "b.agility()"
 *  to get the enemy troop average agility.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - The new advantages
 *  There are 4 new types of advantages: sneak attack, back attack, pincer attack
 *  and surrounded attack. They changes the arrangement of battlers, allowing 
 *  battlers to be attacked from behind and receive increased damage. They are 
 *  avaiable only if the game is set to use sideview battle. Without the sideview
 *  those battle advantages will not occur.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Sneak Attack
 *  Sneak Attacks can happen only if there is a Pre-Emptive attack . The party
 *  gains a free turn (like the pre-emptive), but the enemy party is turned back
 *  during the first turn, receiving extra damage when attacked.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Pincer Attack
 *  Pincer Attack can happen only if there is a Pre-Emptive attack . The party
 *  gains a free turn (like the pre-emptive). The enemies are surrounded, with
 *  the party split on both sides. The enemies always have their back shown to
 *  one of the sides. When attacks the enemy will face it's target, turning their
 *  backs to the actors on the opposing side.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Back Attack
 *  Back Attacks can happen only if there is a Surprise attack . The enemies
 *  gains a free turn (like the surprise), but the player party is turned back
 *  during the first turn, receiving extra damage when attacked.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 
 *  - Surrounded Attack
 *  Surrounded Attack can happen only if there is a Surprise attack . The enemies
 *  gains a free turn (like the surprise). The party is surrounded, with the
 *  enemies split on both sides. The actors always have their back shown to
 *  one of the sides. When attacks the actor will face it's target, turning their
 *  backs to the enemies on the opposing side.
 *
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.02.15 > First release.
 *  v 1.01 - 2016.02.26 > Compatibility with Battler Graphic Setup.
 *  v 1.02 - 2016.03.15 > Compatibility with Basic Module 1.14.
 *  v 1.03 - 2016.05.31 > Compatibility with Battle Motions.
 * =============================================================================
 */
/*:ja
 * @plugindesc v1.03 不意打ち・先制攻撃を強化し、騙し討ち・バックアタック・挟み撃ち・包囲攻撃の4種類が追加されます。
 * @author Victor Sant
 *
 * @param == Advantage Rates ==
 * @text -- アドバンテージ率 --
 * @default ==============================
 *
 * @param Pre Emptive Formula
 * @text 先制攻撃式
 * @desc 先制攻撃発生率の式
 * デフォルト式を使用する場合、無入力 (ヘルプ参照)
 * @default @@
 *
 * @param Surprise Formula
 * @text 不意打ち式
 * @desc 不意打ち発生率の式
 * デフォルト式を使用する場合、無入力 (ヘルプ参照)
 * @default @@
 *
 * @param Sneak Attack Formula
 * @text 騙し討ち式
 * @desc 騙し討ち発生率の式
 * 発生しない場合、無入力 (ヘルプ参照)
 * @default a.agility() > b.agility() ? 50 : 30
 *
 * @param Back Attack Formula
 * @text バックアタック式
 * @desc バックアタック発生率の式
 * 発生しない場合、無入力 (ヘルプ参照)
 * @default a.agility() > b.agility() ? 30 : 50
 *
 * @param Pincer Attack Formula
 * @text 挟み撃ち式
 * @desc 挟み撃ち発生率の式
 * 発生しない場合、無入力 (ヘルプ参照)
 * @default a.agility() > b.agility() ? 50 : 30
 *
 * @param Surrounded Formula
 * @text 包囲攻撃式
 * @desc 包囲攻撃発生率の式
 * 発生しない場合、無入力 (ヘルプ参照)
 * @default a.agility() > b.agility() ? 30 : 50
 *
 * @param == Advantage Texts ==
 * @text -- アドバンテージ・テキスト
 * @default ==============================
 *
 * @param Sneak Attack Message
 * @text 騙し討ちメッセージ
 * @desc 騙し討ち時の表示メッセージ
 * %1:パーティの名前
 * @default %1は騙し討ちに成功！
 *
 * @param Back Attack Message
 * @text バックアタックメッセージ
 * @desc バックアタック時の表示メッセージ
 * %1:パーティの名前
 * @default %1はバックアタックを受けた！
 *
 * @param Pincer Attack Message
 * @text 挟み撃ちメッセージ
 * @desc 挟み撃ち時の表示メッセージ
 * %1:パーティの名前
 * @default %1は挟み撃ちに成功！
 *
 * @param Surrounded Message
 * @text 包囲攻撃メッセージ
 * @desc 包囲攻撃時の表示メッセージ
 * %1:パーティの名前
 * @default %1は包囲攻撃を受けた！
 *
 * @param == Behind Damage ==
 * @text -- 背後攻撃ダメージ --
 * @default ==============================
 *
 * @param Behind Damage
 * @text 背後攻撃ダメージ率
 * @desc 背後攻撃を受けた時の追加ダメージ率
 * Number. 100 = double damage 50 = +50% damage.
 * @default 100
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/battle-advantage/
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
 * No Beind Damage (アクター、職業、敵キャラ、武器、防具、ステート)
 * ---------------------------------------------------------------------------
 *  <no behind damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * このタグがあるバトラーは、後ろから攻撃を受けてもダメージが増えません。
 * ===========================================================================
 *
 * ===========================================================================
 * No Turn Around (アクター、職業、敵キャラ、武器、防具、ステート)
 * ---------------------------------------------------------------------------
 *  <no turn around>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * このタグを持ったバトラーは、その位置に関わらず、
 * デフォルトの方向を変えることはありません。
 * ===========================================================================
 *
 * ===========================================================================
 * No Beind Damage (スキル、アイテム)
 * ---------------------------------------------------------------------------
 *  <no behind damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 背後から攻撃しても、このタグがあるアクションでは、
 * バトラーはダメージが増えません。
 * ===========================================================================
 *
 * ===========================================================================
 *  プラグインコマンド
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  ChanceOfAdvantage
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 次の戦闘は有利になる可能性があります。
 * イベント戦闘は、デフォルトでは有利になるチャンスがありません。
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  ForceAdvantage PreEmptive
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 次の戦闘は自動的に先制攻撃を行います。
 * (パーティはフリーターン)
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  ForceAdvantage Surprise
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 次の戦闘は自動的に不意打ちになります。
 * (敵はフリーターン)
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  ForceAdvantage SneakAttack
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 次の戦闘は自動的に騙し討ちになります。
 * (パーティはフリーターン、敵はターン後振り返る)
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  ForceAdvantage BackAttack
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 次の戦闘は、自動的にバックアタックになります。
 * (敵はフリーターン、パーティメンバーはターン後振り返る)
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  ForceAdvantage PincerAttack
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 次の戦闘では自動的に挟み撃ちになります。
 * (パーティはフリーターン、敵は囲まれる)
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  ForceAdvantage Surrounded
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 次の戦闘で戦った場合、自動的に囲まれた状態での攻撃となります。
 * (敵はフリーターン、パーティメンバーは囲まれる)
 * ===========================================================================
 *
 * ===========================================================================
 *  追加情報
 * ---------------------------------------------------------------------------
 *
 *  - The advantage formulas:
 * この式は、戦闘アドバンテージ効果の発生率を定義します。
 * aはアクターパーティ、bは敵グループ、v[x]は変数として使用できます。
 * 式は評価されるので、有効なJavaScriptであればどんなものでも構いません。
 *
 * パーティの平均敏捷度を取得するには'a.agility()'を、
 * 敵グループの平均敏捷度を取得するには'b.agility()'を使用できます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - The new advantages
 * 騙し討ち、バックアタック、挟み撃ち、包囲攻撃の4種類が追加されます。
 * バトラーの配置を変更して、後ろから攻撃を受けたり、
 * ダメージを受けるようになります。
 * これらはサイドビュー戦闘を使用する場合のみ使用可能です。
 * サイドビューを使用しないと、これらの戦闘の利点は発生しません。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Sneak Attack
 * 騙し討ちは先制攻撃がある場合のみ発生します。
 * パーティはフリーターンを得ますが(先制攻撃と同様)、
 * 敵パーティは最初のターンの間に引き返され、
 * 攻撃を受けた時に追加のダメージを受ける。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Pincer Attack
 * 挟み撃ちは先制攻撃がある場合のみ発生します。
 * パーティはフリーターンを得ます(先制攻撃と同様)。
 * 敵は囲まれており、パーティは左右に分かれています。
 * 敵は常にどちらかの側面に背中を見せています。
 * 敵が攻撃する時、敵は反対側のアクターに背中を向けて、その対象に直面します。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Back Attack
 * バックアタックは不意打ちがある場合のみ発生します。
 * 敵はフリーターンを得ますが、プレイヤーは最初のターンの間に引き返され、
 * 攻撃を受けた時に追加のダメージを受けます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Surrounded Attack
 * 包囲攻撃は不意打ちがある場合のみ発生します。
 * 敵はフリーターンを得ます(不意打ちと同様)。
 * 敵が左右に分かれているステートで、パーティは包囲されています。
 * アクターは常にどちらか片側に背中を見せています。
 * 攻撃する時、アクターは反対側の敵に背中を向けて、その対象に直面します。
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2016.02.15 > First release.
 *  v 1.01 - 2016.02.26 > Compatibility with Battler Graphic Setup.
 *  v 1.02 - 2016.03.15 > Compatibility with Basic Module 1.14.
 *  v 1.03 - 2016.05.31 > Compatibility with Battle Motions.
 * ===========================================================================
 */

(function () {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.BattleAdvantage = {};
        VictorEngine.Parameters.BattleAdvantage.PreEmptiveFormula = String(parameters["Pre Emptive Formula"]).trim();
        VictorEngine.Parameters.BattleAdvantage.SurpriseFormula = String(parameters["Surprise Formula"]).trim();
        VictorEngine.Parameters.BattleAdvantage.SneakFormula = String(parameters["Sneak Attack Formula"]).trim();
        VictorEngine.Parameters.BattleAdvantage.BackAttackFormula = String(parameters["Back Attack Formula"]).trim();
        VictorEngine.Parameters.BattleAdvantage.PincerFormula = String(parameters["Pincer Attack Formula"]).trim();
        VictorEngine.Parameters.BattleAdvantage.SurroundedFormula = String(parameters["Surrounded Formula"]).trim();
        VictorEngine.Parameters.BattleAdvantage.SneakMessage = String(parameters["Sneak Attack Message"]).trim();
        VictorEngine.Parameters.BattleAdvantage.BackAttackMessage = String(parameters["Back Attack Message"]).trim();
        VictorEngine.Parameters.BattleAdvantage.PincerMessage = String(parameters["Pincer Attack Message"]).trim();
        VictorEngine.Parameters.BattleAdvantage.SurroundedMessage = String(parameters["Surrounded Message"]).trim();
        VictorEngine.Parameters.BattleAdvantage.BehindDamage = Number(parameters["Behind Damage"]) || 0;
    };

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.BattleAdvantage.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function (data, index) {
        VictorEngine.BattleAdvantage.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['actor', 'class', 'enemy', 'weapon', 'armor', 'state', 'skill', 'item'])) {
            VictorEngine.BattleAdvantage.loadNotes(data);
        }
    };

    VictorEngine.BattleAdvantage.loadNotes = function (data) {
        var regex1 = new RegExp('<no behind damage>', 'gi');
        var regex2 = new RegExp('<no turn around>', 'gi');
        data.noBehindDamage = !!data.note.match(regex1);
        data.noTurnAround = !!data.note.match(regex2);
    };

    //=============================================================================
    // BattleManager
    //=============================================================================

    VictorEngine.BattleAdvantage.setup = BattleManager.setup;
    BattleManager.setup = function (troopId, canEscape, canLose) {
        $gameParty.clearAdvantage();
        VictorEngine.BattleAdvantage.setup.call(this, troopId, canEscape, canLose);
        if (this.isAdvantageForced()) {
            this.onEncounter();
        }
    };

    VictorEngine.BattleAdvantage.startAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        VictorEngine.BattleAdvantage.startAction.call(this);
        if (this._subject.isSurrounded()) {
            this._subject.turnTowardTargets(this.surroundedTargets());
        }
    };

    VictorEngine.BattleAdvantage.endTurn = BattleManager.endTurn;
    BattleManager.endTurn = function () {
        if (this._surprise && this.isBackAttack()) {
            $gameParty.aliveMembers().forEach(function (member) {
                member.turnTowardOpponents();
            });
        }
        if (this._preemptive && this.isSneakAttack()) {
            $gameTroop.aliveMembers().forEach(function (member) {
                member.turnTowardOpponents();
            });
        }
        VictorEngine.BattleAdvantage.endTurn.call(this);
    };

    VictorEngine.BattleAdvantage.displayStartMessages = BattleManager.displayStartMessages;
    BattleManager.displayStartMessages = function () {
        VictorEngine.BattleAdvantage.displayStartMessages.call(this);
        var parameters = VictorEngine.Parameters.BattleAdvantage;
        if (this._sneakAttack) {
            $gameMessage._texts.pop();
            $gameMessage.add(parameters.SneakMessage.format($gameParty.name()));
        } else if (this._pincerAttack) {
            $gameMessage._texts.pop();
            $gameMessage.add(parameters.PincerMessage.format($gameParty.name()));
        } else if (this._backAttack) {
            $gameMessage._texts.pop();
            $gameMessage.add(parameters.BackAttackMessage.format($gameParty.name()));
        } else if (this._surrounded) {
            $gameMessage._texts.pop();
            $gameMessage.add(parameters.SurroundedMessage.format($gameParty.name()));
        }
    };

    VictorEngine.BattleAdvantage.onEncounter = BattleManager.onEncounter;
    BattleManager.onEncounter = function () {
        VictorEngine.BattleAdvantage.onEncounter.call(this);
        this._pincerAttack = (this._preemptive && Math.random() < this.ratePincerAttack());
        this._surrounded = (this._surprise && Math.random() < this.rateSurrounded());
        this._sneakAttack = (this._preemptive && !this._pincerAttack && Math.random() < this.rateSneakAttack());
        this._backAttack = (this._surprise && !this._surrounded && Math.random() < this.rateBackAttack());
        if (this.isAdvantageForced()) {
            this.forceBattleAdvantage();
        }
        this.setupAdvantagePostions();
    };

    VictorEngine.BattleAdvantage.processEscape = BattleManager.processEscape;
    BattleManager.processEscape = function () {
        if (this.isSurrounded()) {
            var oldRatio = this._escapeRatio;
            this._escapeRatio = this.canEscapeSurrounded() ? oldRatio : 0;
            var success = VictorEngine.BattleAdvantage.processEscape.call(this);
            this._escapeRatio = oldRatio + 0.1;
            return success
        } else {
            return VictorEngine.BattleAdvantage.processEscape.call(this)
        }
    };

    VictorEngine.BattleAdvantage.ratePreemptive = BattleManager.ratePreemptive;
    BattleManager.ratePreemptive = function () {
        if (VictorEngine.Parameters.BattleAdvantage.PreEmptiveFormula) {
            var v = $gameVariables._data;
            var a = $gameParty;
            var b = $gameTroop;
            var r = $gameParty.hasRaisePreemptive() ? 4 : 1
            return eval(VictorEngine.Parameters.BattleAdvantage.PreEmptiveFormula) * r / 100;
        } else {
            return VictorEngine.BattleAdvantage.ratePreemptive.call(this);
        }
    };

    VictorEngine.BattleAdvantage.rateSurprise = BattleManager.rateSurprise;
    BattleManager.rateSurprise = function () {
        if (VictorEngine.Parameters.BattleAdvantage.SurpriseFormula) {
            var v = $gameVariables._data;
            var a = $gameParty;
            var b = $gameTroop;
            var r = $gameParty.hasCancelSurprise() ? 0 : 1
            return eval(VictorEngine.Parameters.BattleAdvantage.SurpriseFormula) * r / 100;
        } else {
            return VictorEngine.BattleAdvantage.rateSurprise.call(this);
        }
    };

    BattleManager.rateSneakAttack = function () {
        if (VictorEngine.Parameters.BattleAdvantage.SneakFormula && $gameSystem.isSideView()) {
            var v = $gameVariables._data;
            var a = $gameParty;
            var b = $gameTroop;
            return eval(VictorEngine.Parameters.BattleAdvantage.SneakFormula) / 100;
        } else {
            return 0;
        }
    };

    BattleManager.rateBackAttack = function () {
        if (VictorEngine.Parameters.BattleAdvantage.BackAttackFormula && $gameSystem.isSideView()) {
            var v = $gameVariables._data;
            var a = $gameParty;
            var b = $gameTroop;
            return eval(VictorEngine.Parameters.BattleAdvantage.BackAttackFormula) / 100;
        } else {
            return 0;
        }
    };

    BattleManager.ratePincerAttack = function () {
        if (VictorEngine.Parameters.BattleAdvantage.PincerFormula && this.isPincerValid()) {
            var v = $gameVariables._data;
            var a = $gameParty;
            var b = $gameTroop;
            return eval(VictorEngine.Parameters.BattleAdvantage.PincerFormula) / 100;
        } else {
            return 0;
        }
    };

    BattleManager.rateSurrounded = function () {
        if (VictorEngine.Parameters.BattleAdvantage.SurroundedFormula && this.isSurroundedValid()) {
            var v = $gameVariables._data;
            var a = $gameParty;
            var b = $gameTroop;
            return eval(VictorEngine.Parameters.BattleAdvantage.SurroundedFormula) / 100;
        } else {
            return 0;
        }
    };

    BattleManager.isAdvantageForced = function () {
        return ($gameSystem._chanceAdvantage || $gameSystem._forcePreemptive ||
            $gameSystem._forceSurprise || $gameSystem._forceSneakAttack ||
            $gameSystem._forceBackAttack || $gameSystem._forceSurrounded ||
            $gameSystem._forcePincerAttack);
    };

    BattleManager.isPincerValid = function () {
        return $gameSystem.isSideView() && $gameParty.battleMembers().length > 1;
    };

    BattleManager.isSurroundedValid = function () {
        return $gameSystem.isSideView() && $gameTroop.aliveMembers().length > 1;
    };

    BattleManager.forceBattleAdvantage = function () {
        var forcePreemptive = $gameSystem._forcePreemptive;
        var forceSurprise = $gameSystem._forceSurprise;
        var forceSneakAttack = $gameSystem._forceSneakAttack;
        var forceBackAttack = $gameSystem._forceBackAttack;
        var forcePincerAttack = $gameSystem._forcePincerAttack;
        var forceSurrounded = $gameSystem._forceSurrounded;
        this.clearAdvantage();
        if (forcePreemptive) {
            this._preemptive = true;
        } else if (forceSurprise) {
            this._surprise = true;
        } else if (forceSneakAttack && $gameSystem.isSideView()) {
            this._preemptive = true;
            this._sneakAttack = true;
        } else if (forceBackAttack && $gameSystem.isSideView()) {
            this._surprise = true;
            this._backAttack = true;
        } else if (forcePincerAttack && this.isPincerValid()) {
            this._preemptive = true;
            this._pincerAttack = true;
        } else if (forceSurrounded && this.isSurroundedValid()) {
            this._surprise = true;
            this._surrounded = true;
        }
    };

    BattleManager.setupAdvantagePostions = function () {
        $gameTroop.resetDirections();
        $gameParty.resetDirections();
        if (this._sneakAttack) {
            $gameParty.setupSneakAttack();
            $gameTroop.setupBackAttack();
        } else if (this._backAttack) {
            $gameTroop.setupSneakAttack();
            $gameParty.setupBackAttack();
        } else if (this._pincerAttack) {
            $gameTroop.setupSurrounded();
            $gameParty.setupPincer();
        } else if (this._surrounded) {
            $gameParty.setupSurrounded();
            $gameTroop.setupPincer();
        }
    };

    BattleManager.clearAdvantage = function () {
        this._preemptive = false;
        this._sneakAttack = false;
        this._pincerAttack = false;
        this._surprise = false;
        this._backAttack = false;
        this._surrounded = false;
        $gameSystem.clearAdvantage()
    };

    BattleManager.isSneakAttack = function () {
        return this._sneakAttack;
    };

    BattleManager.pincerAttack = function () {
        return this._pincerAttack;
    };

    BattleManager.isBackAttack = function () {
        return this._backAttack;
    };

    BattleManager.isSurrounded = function () {
        return this._surrounded;
    };

    BattleManager.noStartMovement = function () {
        return this._surrounded || this._backAttack;
    };

    BattleManager.surroundedTargets = function () {
        var subject = this._subject;
        var targets = this._targets;
        return targets.filter(function (target) {
            return subject.isEnemy() !== target.isEnemy();
        });
    };

    BattleManager.canEscapeSurrounded = function () {
        var aliveLeft = $gameTroop.members().some(function (member, i) {
            return member.isAlive() && i % 2 === 0;
        })
        var aliveRight = $gameTroop.members().some(function (member, i) {
            return member.isAlive() && i % 2 !== 0;
        })
        return !aliveLeft || !aliveRight;
    };

    //=============================================================================
    // Game_System
    //=============================================================================

    VictorEngine.BattleAdvantage.initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        VictorEngine.BattleAdvantage.initialize.call(this);
        this.clearAdvantage();
    };

    Game_System.prototype.clearAdvantage = function () {
        this._chanceAdvantage = false;
        this._forcePreemptive = false;
        this._forceSurprise = false;
        this._forceSneakAttack = false;
        this._forceBackAttack = false;
        this._forcePincerAttack = false;
        this._forceSurrounded = false;
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    VictorEngine.BattleAdvantage.makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function (target, critical) {
        var value = VictorEngine.BattleAdvantage.makeDamageValue.call(this, target, critical);
        var rate = VictorEngine.Parameters.BattleAdvantage.BehindDamage;
        if (this.attackFromBehind(target) && value > 0) {
            value += value * rate / 100;
        }
        return Math.floor(value);
    };

    VictorEngine.BattleAdvantage.itemEva = Game_Action.prototype.itemEva;
    Game_Action.prototype.itemEva = function (target) {
        if (this.attackFromBehind(target)) {
            return 0;
        } else {
            return VictorEngine.BattleAdvantage.itemEva.call(this, target);
        }
    };

    Game_Action.prototype.attackFromBehind = function (target) {
        return this.subject().isBehind(target) && !this.noBehindDamge(target);
    };

    Game_Action.prototype.noBehindDamge = function (target) {
        var objects = target.traitObjects().concat(this.item());
        return objects.some(function (data) {
            return data.noBehindDamage;
        });
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

    VictorEngine.BattleAdvantage.revive = Game_BattlerBase.prototype.revive;
    Game_BattlerBase.prototype.revive = function () {
        VictorEngine.BattleAdvantage.revive.call(this);
        if ((this.isEnemy() && BattleManager.isSneakAttack()) ||
            (this.isActor() && BattleManager.isBackAttack())) {
            this.turnTowardOpponents();
        }
    };

    Game_BattlerBase.prototype.isSneakAttack = function () {
        return this._sneakAttack;
    };

    Game_BattlerBase.prototype.isBackAttack = function () {
        return this._backAttack;
    };

    Game_BattlerBase.prototype.isPincerAttack = function () {
        return this._pincerAttack;
    };

    Game_BattlerBase.prototype.isSurrounded = function () {
        return this._surrounded;
    };

    Game_BattlerBase.prototype.setSneakAttack = function () {
        this._sneakAttack = true;
    };

    Game_BattlerBase.prototype.setBackAttack = function () {
        this._backAttack = true;
    };

    Game_BattlerBase.prototype.setPincerAttack = function () {
        this._pincerAttack = true;
    };

    Game_BattlerBase.prototype.setSurrounded = function () {
        this._surrounded = true;
    };

    Game_BattlerBase.prototype.clearAdvantage = function () {
        this._sneakAttack = false;
        this._backAttack = false;
        this._pincerAttack = false;
        this._surrounded = false;
    };

    Game_BattlerBase.prototype.resetDirections = function () {
        return this._battlerDirection = null;
    };

    Game_BattlerBase.prototype.noTurnAround = function () {
        var objects = this.traitObjects();
        return objects.some(function (data) {
            return data.noTurnAround;
        });
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

    VictorEngine.BattleAdvantage.onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function () {
        VictorEngine.BattleAdvantage.onBattleEnd.call(this);
        this.clearAdvantage();
    };

    //=============================================================================
    // Game_Enemy
    //=============================================================================

    /* Overwritten function */
    Game_Enemy.prototype.screenX = function () {
        return Game_BattlerBase.prototype.screenX.call(this);
    };

    /* Overwritten function */
    Game_Enemy.prototype.screenY = function () {
        return Game_BattlerBase.prototype.screenY.call(this);
    };

    //=============================================================================
    // Game_Unit
    //=============================================================================

    Game_Unit.prototype.setupBackAttack = function () {
        this.members().forEach(function (member) {
            member.turnAwayFromCenter()
        });
    };

    Game_Unit.prototype.clearAdvantage = function () {
        this.members().forEach(function (member) {
            member.clearAdvantage()
        });
    };

    Game_Unit.prototype.setupSneakAttack = function () {
        this.members().forEach(function (member) {
            member.setSneakAttack()
        });
    };

    Game_Unit.prototype.setupBackAttack = function () {
        this.members().forEach(function (member) {
            member.setBackAttack()
        });
    };

    Game_Unit.prototype.setupPincer = function () {
        this.members().forEach(function (member) {
            member.setPincerAttack()
        });
    };

    Game_Unit.prototype.setupSurrounded = function () {
        this.members().forEach(function (member) {
            member.setSurrounded()
        });
    };

    Game_Unit.prototype.resetDirections = function () {
        this.members().forEach(function (member) {
            member.resetDirections()
        });
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================

    VictorEngine.BattleAdvantage.pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        VictorEngine.BattleAdvantage.pluginCommand.call(this, command, args);
        if (command.toLowerCase() === 'chanceofadvantage') {
            $gameSystem._chanceAdvantage = true;
        }
        if (command.toLowerCase() === 'forceadvantage') {
            $gameSystem.clearAdvantage();
            switch (args[0].toLowerCase()) {
                case 'preemptive':
                    $gameSystem._forcePreemptive = true;
                    break;
                case 'surprise':
                    $gameSystem._forceSurprise = true;
                    break;
                case 'sneakattack':
                    $gameSystem._forceSneakAttack = true;
                    break;
                case 'backattack':
                    $gameSystem._forceBackAttack = true;
                    break;
                case 'pincerattack':
                    $gameSystem._forcePincerAttack = true;
                    break;
                case 'surrounded':
                    $gameSystem._forceSurrounded = true;
                    break;
            }
        }
    };

    //=============================================================================
    // Sprite_Battler
    //=============================================================================

    VictorEngine.BattleAdvantage.noEntryMove = Sprite_Battler.prototype.noEntryMove;
    Sprite_Battler.prototype.noEntryMove = function () {
        return VictorEngine.BattleAdvantage.noEntryMove.call(this) || this.noAdvantageIntroMove();
    };

    VictorEngine.BattleAdvantage.setHome = Sprite_Battler.prototype.setHome;
    Sprite_Battler.prototype.setHome = function (x, y) {
        if (this._battler && this._battler.isBackAttack()) {
            this.backAttackPosition(Math.floor(x), Math.floor(y));
        } else if (this._battler && this._battler.isSneakAttack()) {
            this.sneakAttackPosition(Math.floor(x), Math.floor(y));
        } else if (this._battler && this._battler.isPincerAttack()) {
            this.pincerAttackPosition(Math.floor(x), Math.floor(y));
        } else if (this._battler && this._battler.isSurrounded()) {
            this.surroundedPosition(Math.floor(x), Math.floor(y));
        } else {
            VictorEngine.BattleAdvantage.setHome.call(this, x, y);
            this.updatePosition();
        }
    };

    Sprite_Battler.prototype.moveToStartPosition = function () {
        if (!this.isMoving() && $gameSystem.isSideView() && !this.noEntryMove()) {
            var move = (this._battler && this._battler.isFacingRight()) ? -300 : 300
            this.startMove(move, 0, 0);
        }
    };

    Sprite_Battler.prototype.stepForward = function () {
        if (this.inHomePosition() && $gameSystem.isSideView()) {
            var move = (this._battler && this._battler.isFacingRight()) ? 48 : -48
            this.startMotion('walk');
            this.startMove(move, 0, 12);
        }
    };

    Sprite_Battler.prototype.stepBack = function () {
        this.startMotion(Imported['VE - Battler Graphic Setup'] ? 'return' : 'escape');
        this.startMove(0, 0, 12);
    };

    Sprite_Battler.prototype.retreat = function () {
        if ($gameSystem.isSideView()) {
            if (this._battler.isSurrounded()) {
                this._battler.turnTowardOpponents();
            }
            var value = BattleManager.isSurrounded() ? 600 : 300
            var speed = BattleManager.isSurrounded() ? 60 : 30
            var move = (this._battler && this._battler.isFacingRight()) ? -value : value
            this.startMove(move, 0, speed);
        }
    };

    Sprite_Battler.prototype.noAdvantageIntroMove = function () {
        return this._battler && (this._battler.isSurrounded() || this._battler.isBackAttack());
    };

    //=============================================================================
    // Sprite_Actor
    //=============================================================================

    /* Overwritten function */
    Sprite_Actor.prototype.moveToStartPosition = function () {
        Sprite_Battler.prototype.moveToStartPosition.call(this);
    };

    /* Overwritten function */
    Sprite_Actor.prototype.stepForward = function () {
        Sprite_Battler.prototype.stepForward.call(this);
    };

    /* Overwritten function */
    Sprite_Actor.prototype.stepBack = function () {
        Sprite_Battler.prototype.stepBack.call(this);
    };

    /* Overwritten function */
    Sprite_Actor.prototype.retreat = function () {
        Sprite_Battler.prototype.retreat.call(this);
    };

    VictorEngine.BattleAdvantage.updateFrameSpriteActor = Sprite_Actor.prototype.updateFrame;
    Sprite_Actor.prototype.updateFrame = function () {
        VictorEngine.BattleAdvantage.updateFrameSpriteActor.call(this);
        this.updateBattlerDirection();
    };

    VictorEngine.BattleAdvantage.damageOffsetX = Sprite_Actor.prototype.damageOffsetX;
    Sprite_Actor.prototype.damageOffsetX = function () {
        var result = VictorEngine.BattleAdvantage.damageOffsetX.call(this)
        return (this._actor && this._actor.isFacingRight()) ? -result : result;
    };

    Sprite_Actor.prototype.sneakAttackPosition = function (x, y) {
        VictorEngine.BattleAdvantage.setHome.call(this, x, y);
        this.updatePosition();
    };

    Sprite_Actor.prototype.backAttackPosition = function (x, y) {
        this.startMove(0, 0, 0);
        VictorEngine.BattleAdvantage.setHome.call(this, Graphics.boxWidth - x, y);
        this.updatePosition();
        this._actor.turnAwayFromCenter();
    };

    Sprite_Actor.prototype.pincerAttackPosition = function (x, y) {
        var party = $gameParty.members();
        var index = party.indexOf(this._actor);
        var ox = x;
        var gw = Graphics.boxWidth;
        var ni = Math.floor(index / 2)
        var nx = Math.abs(ox < gw / 2 ? ox / 4 : (gw - ox) / 4)
        var px = Math.floor(index % 2 === 0 ? gw - 96 - nx + ni * 32 : 96 + nx - ni * 32);
        var py = Math.floor(280 + ni * 48);
        this.startMove(0, 0, 0)
        VictorEngine.BattleAdvantage.setHome.call(this, px, py);
        this.updatePosition();
        this._actor.turnTowardCenter();
        this.moveToStartPosition();
    };

    Sprite_Actor.prototype.surroundedPosition = function (x, y) {
        var party = $gameParty.members();
        var index = party.indexOf(this._actor);
        var ox = x;
        var gw = Graphics.boxWidth;
        var rx = (ox < gw / 2) ? ox - gw / 4 : ox - (gw - gw / 4);
        var px = Math.floor(gw / 2 + rx / 2);
        var py = Math.floor(y);
        this.startMove(0, 0, 0)
        VictorEngine.BattleAdvantage.setHome.call(this, px, py);
        this.updatePosition();
        if (index % 2 === 0) {
            this._actor.turnRight();
        } else {
            this._actor.turnLeft();
        };
    };

    //=============================================================================
    // Sprite_Enemy
    //=============================================================================

    VictorEngine.BattleAdvantage.updateFrameSpriteEnemy = Sprite_Enemy.prototype.updateFrame;
    Sprite_Enemy.prototype.updateFrame = function () {
        VictorEngine.BattleAdvantage.updateFrameSpriteEnemy.call(this);
        this.updateBattlerDirection();
    };

    Sprite_Enemy.prototype.sneakAttackPosition = function (x, y) {
        VictorEngine.BattleAdvantage.setHome.call(this, Graphics.width - x, y);
        this.updatePosition();
        this._enemy.turnTowardCenter();
    };

    Sprite_Enemy.prototype.backAttackPosition = function (x, y) {
        VictorEngine.BattleAdvantage.setHome.call(this, x, y);
        this.updatePosition();
        this._enemy.turnAwayFromCenter();
    };

    Sprite_Enemy.prototype.pincerAttackPosition = function (x, y) {
        var party = $gameTroop.members();
        var index = party.indexOf(this._enemy);
        var ox = x;
        var gw = Graphics.boxWidth;
        var ni = Math.floor(index / 2);
        var nl = Math.floor(party.length / 2) + 2;
        var nx = Math.abs(ox < gw / 2 ? ox / 3 : (gw - ox) / 3)
        var px = Math.floor(index % 2 == 0 ? gw - 96 - nx : 96 + nx);
        var py = 296 + Math.floor(ni * 256 / nl);
        VictorEngine.BattleAdvantage.setHome.call(this, px, py);
        this.updatePosition();
        this._enemy.turnTowardCenter();
    };

    Sprite_Enemy.prototype.surroundedPosition = function (x, y) {
        var party = $gameTroop.members();
        var index = party.indexOf(this._enemy);
        var ox = x;
        var gw = Graphics.width;
        var rx = (ox < gw / 2) ? ox - gw / 4 : ox - (gw - gw / 4);
        var px = Math.floor(gw / 2 + rx);
        var py = Math.floor(y);
        VictorEngine.BattleAdvantage.setHome.call(this, px, py);
        this.updatePosition();
        if (this._enemy.screenX() > gw / 2) {
            this._enemy.turnRight();
        } else {
            this._enemy.turnLeft();
        };
    };

})();