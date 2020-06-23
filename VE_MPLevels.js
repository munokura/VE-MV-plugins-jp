/*
 * ==============================================================================
 * ** Victor Engine MV - MP Levels
 * ------------------------------------------------------------------------------
 *  VE_MPLevels.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - MP Levels'] = '1.00';

var VictorEngine = VictorEngine || {};
VictorEngine.MPLevels = VictorEngine.MPLevels || {};

(function () {

    VictorEngine.MPLevels.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        VictorEngine.MPLevels.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - MP Levels', 'VE - Basic Module', '1.20');
    };

    VictorEngine.MPLevels.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function (name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.MPLevels.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * @plugindesc v1.00 - Skills MP costs are divided in levels.
 * @author Victor Sant
 *
 * @param Max MP Level
 * @desc Max number of MP Levels available.
 * Default: 3 (Numeric)
 * @default 3
 *
 * @param Max MP Value
 * @desc Max value for MP of all levels.
 * Default: 99 (Numeric)
 * @default 99
 *
 * @param MP Level Name
 * @desc MP Level name displayed on windows.
 * Default: \c[16]MP (allows escape code)
 * @default \c[16]MP
 *
 * @param MP Display Format
 * @desc Default number of MP Levels available
 * %1 = Value    %2 = level    %3 = icon  (allows escape code)
 * @default \}\c[29]L%2 \c[0]%1
 *
 * @param Separator Symbol
 * @desc Separator used between each MP Level value.
 * Default: \}/ (allows escape code)
 * @default \}/
 *
 * @param Line Break
 * @desc Add a line break after a specific number of Mp level displays.
 * Default: 3 (Numeric)
 * @default 3
 *
 * @param MP Level Icons
 * @desc Id of the icons for each MP level.
 * Id of the Icons (separate by commas in order of level)
 * @default 90, 91, 92
 *
 * @param MP Cost Format
 * @desc Default number of MP Levels available.
 * %1 = Cost    %2 = level    %3 = icon  (allows escape code)
 * @default \c[29]L%2 \c[23]%1
 *
 * @param Replace Display
 * @desc Replaces the MP or TP default display with MP Level.
 * Default: MP (MP or TP, leave blank to not replace)
 * @default MP
 *
 * @help 
 * ==============================================================================
 *  Notetags:
 * ==============================================================================
 *
 * ==============================================================================
 *  MP Level Growth (tag for Actors, Classes, Enemies, Weapons, Armors, States)
 * ------------------------------------------------------------------------------
 *  <mp level growth: level, max>
 *   result = growth
 *  </mp level growth>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    Set a custom MP Level growth and max value.
 *      level  : level of the MP.
 *      max    : max MP value. Can't be higher than the 'Max MP Value' Pluhin
 *               Parameter.
 *      growth : growth value. Script code. (more details bellow)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <mp level growth: 1, 99>
 *        result = 5 + a.level / 5;
 *       </mp level growth>
 * ==============================================================================
 *
 * ==============================================================================
 *  Max MP Level (notetag for Actors, Classes, Enemies, Weapons, Armors, States)
 * ------------------------------------------------------------------------------
 *  <max mp level: value>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Setup the number of MP Levels available.
 *     value : number of levels. Can't be higher than the Plugin Parameter
 *             'Max MP Level'.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <max mp level: 4>
 *       <max mp level: 10>
 * ==============================================================================
 *
 * ==============================================================================
 *  MP Level Plus (notetag for Actors, Classes, Enemies, Weapons, Armors, States)
 * ------------------------------------------------------------------------------
 *  <mp level plus: level, value>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    Change the max MP from a level by a set value
 *      level : level of the MP.
 *      value : value changed. (can be negative)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <mp level plus: 1, +10>
 *       <mp level plus: 3, -2>
 * ==============================================================================
 *
 * ==============================================================================
 *  MP Level Rate (tag for Actors, Classes, Enemies, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <mp level rate: level, value%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    Change the cost of skills from a level by a % value.
 *      level : level of the MP.
 *      value : value changed. (% value, can be negative)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <mp level rate: 1, +25%>
 *       <mp level rate: 3, -50%>
 * ==============================================================================
 *
 * ==============================================================================
 *  MP Level Gain (notetag for Skills and Items)
 * ------------------------------------------------------------------------------
 *  <mp level gain: level>
 *   result = gain
 *  </mp level growth>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    Set a custom MP Level growth and max value.
 *      level : level of the MP.
 *      gain  : value gained. Script code. (more details bellow)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <mp level gain: 2>
 *        result = 10;
 *       </mp level gain>
 * ==============================================================================
 *
 * ==============================================================================
 *  MP Level Cost (notetag for Skills)
 * ------------------------------------------------------------------------------
 *  <mp level cost: level, value>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    Setup the MP Level cost for the skill.
 *      level : level of the MP.
 *      value : cost value. (Numeric)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <mp level rate: 1, 3>
 *       <mp level rate: 2, 10>
 * ==============================================================================
 * 
 * ==============================================================================
 *  Plugin Commands
 * ------------------------------------------------------------------------------
 *
 *  You can use v[id] on the instead of a numeric value to get the value from 
 *  the variable with the id set. For example, v[3] will get the value from the
 *  variable id 3.
 *
 * ------------------------------------------------------------------------------
 *  GainMPLevel actor id level value
 *  GainMPLevel party id level value
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    Gains an amount of MP of a specific level.
 *      actor : the target will be decided by the actor Id.
 *      party : the target will be decided by the position in party.
 *      id    : actor id or the actor position in party.
 *      level : level of the MP.
 *      value : value gained. Can be negative.
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  MaxMPLevel actor id level value
 *  MaxMPLevel party id level value
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    Changes the max MP of a specific level.
 *      actor : the target will be decided by the actor Id.
 *      party : the target will be decided by the position in party.
 *      id    : actor id or the actor position in party.
 *      level : level of the MP.
 *      value : value changed. Can be negative.
 * ------------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------------
 *  RecoverAllMPLevels
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Recover all MP from all levels for the party memebers.
 * ==============================================================================
 * 
 * ==============================================================================
 * Additional Information:
 * ------------------------------------------------------------------------------
 *
 *  - Max MP Level:
 *  You need to assign a max mp level for the battler using the notetag
 *  <max mp level: value>, otherwise the battler will have no mp levels even
 *  if you setup a formula for it.
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - MP Level Growth and MP Level Gain:
 *  The MP Level Growth and MP Level Gain are formulas that uses the same values
 *  the damage formula, so you can use "a" for the user and "v[x]" for variable. 
 *  The 'result' must return a numeric value.
 *
 *  NOTE: Enemies by default don't have levels, so if you use levels on your
 *  growth formula, enemies will end without MP Level. You can solve that
 *  by giving a different formula for the enemy tech skills.
 *
 *  If a battler have multiple values for the growth of the MP Level, the
 *  highest one will be used.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Replace Display
 *  You can make it so the MP Levels display replaces either the normal MP 
 *  display or the TP display. This will replace only the default display, 
 *  custom displays might not get replaced.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - MP Level and VE - Battle Status Window
 *  If using the plugin 'VE - Battle Status Window', you can use a script code
 *  to display the MP Level on the battle status window. Use the following code 
 *  on one of the fields for 'Custom Codes':
 *    this.drawActorMpLevels(actor, x, y);
 * 
 *  You can adjust the value of X and Y as you need, for example:
 *    this.drawActorMpLevels(actor, x + 32, y + 64);
 *
 * ==============================================================================
 *
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.05.12 > First release.
 */
/*:ja
 * @plugindesc v1.00 スキルMPコストをレベル分けします
 * @author Victor Sant
 *
 * @param Max MP Level
 * @text 最大MPレベル
 * @type number
 * @desc 利用可能なMPレベルの最大数
 * デフォルト: 3 (数値)
 * @default 3
 *
 * @param Max MP Value
 * @text 最大MP値
 * @type number
 * @desc 全てのレベルのMPの最大値
 * デフォルト: 99 (数値)
 * @default 99
 *
 * @param MP Level Name
 * @text MPレベル名
 * @desc ウィンドウに表示されるMPレベル名
 * デフォルト: \c[16]MP (制御文字が使用可能)
 * @default \c[16]MP
 *
 * @param MP Display Format
 * @text MP表示形式
 * @desc 利用可能なMPレベルのデフォルト値
 * %1:値 / %2:レベル / %3:アイコン (制御文字が使用可能)
 * @default \}\c[29]L%2 \c[0]%1
 *
 * @param Separator Symbol
 * @text 区切り文字
 * @desc 各MPレベル値の間に使用する区切り文字
 * デフォルト: \}/ (制御文字が使用可能)
 * @default \}/
 *
 * @param Line Break
 * @text 改行
 * @type number
 * @desc 特定のMPレベルの表示数の後に改行を追加
 * デフォルト: 3 (数値)
 * @default 3
 *
 * @param MP Level Icons
 * @text MPレベルのアイコン
 * @desc 各MPレベルのアイコンID
 * (レベル順にカンマで区切)
 * @default 90, 91, 92
 *
 * @param MP Cost Format
 * @text MPコスト表示形式
 * @desc 利用可能なMPレベルのデフォルト値
 * %1:コスト / %2:レベル / %3:アイコン (制御文字が使用可能)
 * @default \c[29]L%2 \c[23]%1
 *
 * @param Replace Display
 * @text 表示の置換
 * @type select
 * @option MPと置換
 * @value MP
 * @option TPと置換
 * @value TP
 * @option 置換しない
 * @value
 * @desc MP/TPのデフォルト表示をMPレベルに置換
 * デフォルト: MP (MP / TP, 置換しない場合、空白)
 * @default MP
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/mp-levels/
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
 *  MPレベルの成長 (アクター、職業、敵キャラ、武器、防具、ステートのタグ)
 * ---------------------------------------------------------------------------
 *  <mp level growth: level, max>
 *   result = growth
 *  </mp level growth>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    カスタムMPレベルの成長値と最大値を設定します。
 *      level  : MPのレベル
 *      max    : MPの最大値。プラグインパラメータ'Max MP Value'より
 *               高くすることはできません。
 *      growth : 成長値。スクリプト (後述)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例 : <mp level growth: 1, 99>
 *        result = 5 + a.level / 5;
 *       </mp level growth>
 * ===========================================================================
 *
 * ===========================================================================
 *  最大MPレベル (アクター、職業、敵キャラ、武器、防具、ステートのタグ)
 * ---------------------------------------------------------------------------
 *  <max mp level: value>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   使用可能なMPレベル数を設定します。
 *     value : MPの最大値。プラグインパラメータ'Max MP Value'より
 *             高くすることはできません。
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例 : <max mp level: 4>
 *       <max mp level: 10>
 * ===========================================================================
 *
 * ===========================================================================
 *  MPレベルプラス (アクター、職業、敵キャラ、武器、防具、ステートのタグ)
 * ---------------------------------------------------------------------------
 *  <mp level plus: level, value>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    レベルから最大MPを設定値で変更します。
 *      level : MPのレベル
 *      value : 変更値 (正負の値)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例 : <mp level plus: 1, +10>
 *       <mp level plus: 3, -2>
 * ===========================================================================
 *
 * ===========================================================================
 *  MPレベル率 (アクター、職業、敵キャラ、武器、防具、ステートのタグ)
 * ---------------------------------------------------------------------------
 *  <mp level rate: level, value%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    レベルからスキルのコストを%値で変更します。
 *      level : MPのレベル
 *      value : 変更値 (正負の%値)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例 : <mp level rate: 1, +25%>
 *       <mp level rate: 3, -50%>
 * ===========================================================================
 *
 * ===========================================================================
 *  MPレベル獲得値 (スキル、アイテムのタグ)
 * ---------------------------------------------------------------------------
 *  <mp level gain: level>
 *   result = gain
 *  </mp level growth>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    カスタムMPレベルの成長値と最大値を設定します。
 *      level : MPのレベル
 *      gain  : 獲得値。 スクリプト (後述)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例 : <mp level gain: 2>
 *        result = 10;
 *       </mp level gain>
 * ===========================================================================
 *
 * ===========================================================================
 *  MP Level Cost (notetag for Skills)
 * ---------------------------------------------------------------------------
 *  <mp level cost: level, value>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    スキルのMPレベルのコストを設定します。
 *      level : MPのレベル
 *      value : コスト値 (数値)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例 : <mp level rate: 1, 3>
 *       <mp level rate: 2, 10>
 * ===========================================================================
 *
 * ===========================================================================
 *  プラグインコマンド
 * ---------------------------------------------------------------------------
 *
 * 数値の代わりにv[id]を使用して、
 * idが設定された変数から値を取得できます。
 * 例えば、v[3]は変数ID3から値を取得します。
 *
 * ---------------------------------------------------------------------------
 *  GainMPLevel actor id level value
 *  GainMPLevel party id level value
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    特定のレベルのMPを獲得します。
 *      actor : 対象はアクターIDで決定します。
 *      party : 対象はパーティ内の位置で決定します。
 *      id    : パーティ内のアクターID・アクター位置
 *      level : MPのレベル
 *      value : value gained. Can be negative.
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  MaxMPLevel actor id level value
 *  MaxMPLevel party id level value
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *    Changes the max MP of a specific level.
 *      actor : 対象はアクターIDで決定します。
 *      party : 対象はパーティ内の位置で決定します。
 *      id    : パーティ内のアクターID・アクター位置
 *      level : MPのレベル
 *      value : 変更値。正負の値
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  RecoverAllMPLevels
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   パーティメンバーの全レベルのMPを回復する。
 * ===========================================================================
 *
 * ===========================================================================
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 *  - 最大MPレベル
 * バトラーに最大のMPレベルを設定するには、
 * <max mp level: value>というメモタグを使用する必要があります。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - MPレベルの成長とMPレベルの獲得
 * MPレベルの成長とMPレベルの獲得は、ダメージの式と同じ値を使う式なので、
 * 使用者には'a'、変数には'v[x]'を使うことができます。
 * 'result'は数値を返す必要があります。
 *
 * 注意:敵はデフォルトではレベルを持っていないので、
 * 成長の式でレベルを使用すると、敵はMPレベルなしで終了してしまいます。
 * この問題は、敵の技術スキルに別の式を与えることで解決できます。
 *
 * バトラーがMPレベルの成長値を複数持っている場合、
 * 最も高いものが使用されます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - 表示の置換
 * MPレベル表示を通常のMP表示とTP表示のどちらかに置き換えられます。
 * デフォルトの表示のみが置き換えられますが、
 * カスタム表示は置き換えられない場合があります。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - MP Level と VE - Battle Status Window
 * 'VE - Battle Status Window'プラグインを使用している場合、
 * バトルステータスウィンドウにMPレベルを表示するスクリプトを使用できます。
 * 'Custom Codes'のフィールドの1つに以下のコードを使用します。
 *    this.drawActorMpLevels(actor, x, y);
 *
 *  例えば、xとyの値は、必要に応じて調整できます。
 *    this.drawActorMpLevels(actor, x + 32, y + 64);
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2016.05.12 > First release.
 */

(function () {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.MPLevels = {};
        VictorEngine.Parameters.MPLevels.MaxMPLevel = Number(parameters["Max MP Level"]) || 0;
        VictorEngine.Parameters.MPLevels.MaxMPValue = Number(parameters["Max MP Value"]) || 1;
        VictorEngine.Parameters.MPLevels.LineBreak = Number(parameters["Line Break"]) || 1;
        VictorEngine.Parameters.MPLevels.MPLevelName = String(parameters["MP Level Name"]).trim();
        VictorEngine.Parameters.MPLevels.MPDisplayFormat = String(parameters["MP Display Format"]).trim();
        VictorEngine.Parameters.MPLevels.MPLevelIcons = String(parameters["MP Level Icons"]).trim();
        VictorEngine.Parameters.MPLevels.SeparatorSymbol = String(parameters["Separator Symbol"]).trim();
        VictorEngine.Parameters.MPLevels.MPCostFormat = String(parameters["MP Cost Format"]).trim();
        VictorEngine.Parameters.MPLevels.ReplaceDisplay = String(parameters["Replace Display"]).trim();
    }

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.MPLevels.loadParameters = VictorEngine.loadParameters;
    VictorEngine.loadParameters = function () {
        VictorEngine.MPLevels.loadParameters.call(this);
        VictorEngine.MPLevels.processParameters();
    };

    VictorEngine.MPLevels.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function (data, index) {
        VictorEngine.MPLevels.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['actor', 'class', 'weapon', 'armor', 'enemy', 'state'])) {
            VictorEngine.MPLevels.loadNotes1(data);
        }
        if (this.objectSelection(index, ['skill', 'item'])) {
            VictorEngine.MPLevels.loadNotes2(data);
        }
    };

    VictorEngine.MPLevels.processParameters = function () {
        if (this.loaded) return;
        this.loaded = true;
        this.levelIcons = VictorEngine.Parameters.MPLevels.MPLevelIcons.split(/[ ]*[;,][ ]*/i);
    };

    VictorEngine.MPLevels.loadNotes1 = function (data) {
        data.MPLevels = data.MPLevels || {};
        this.processNotes1(data);
    };

    VictorEngine.MPLevels.loadNotes2 = function (data) {
        data.MPLevels = data.MPLevels || {};
        this.processNotes2(data);
    };

    VictorEngine.MPLevels.processNotes1 = function (data, type) {
        var match;
        var part1 = 'mp level growth';
        var regex1 = new RegExp('<max mp level:[ ]*(\\d+)[ ]*>', 'gi');
        var regex2 = new RegExp('<mp level plus:[ ]*(\\d+)[ ]*,[ ]*([+-]?\\d+)[ ]*>', 'gi');
        var regex3 = new RegExp('<mp level rate:[ ]*(\\d+)[ ]*,[ ]*([+-]?\\d+)%?[ ]*>', 'gi');
        var regex4 = VictorEngine.getNotesValues(part1 + '[ ]*:[ ]*(\\d+)[ ]*,[ ]*(\\d+)[ ]*', part1);
        while (match = regex1.exec(data.note)) {
            this.processValues1(data, match);
        };
        while (match = regex2.exec(data.note)) {
            this.processValues2(data, match);
        };
        while (match = regex3.exec(data.note)) {
            this.processValues3(data, match);
        };
        while (match = regex4.exec(data.note)) {
            this.processValues4(data, match);
        };
        data.MPLevels.infinite = data.note.match(/<infinite mp level>/i);
    };

    VictorEngine.MPLevels.processNotes2 = function (data, type) {
        var match;
        var regex1 = new RegExp('<mp level cost:[ ]*(\\d+)[ ]*,[ ]*(\\d+)[ ]*>', 'gi');
        var regex2 = VictorEngine.getNotesValues('mp level gain[ ]*:[ ]*(\\d+)[ ]*', 'mp level gain');
        while (match = regex1.exec(data.note)) {
            this.processValues3(data, match);
        };
        while (match = regex2.exec(data.note)) {
            this.processValues5(data, match);
        };
    };

    VictorEngine.MPLevels.processValues1 = function (data, match) {
        var max = VictorEngine.Parameters.MPLevels.MaxMPLevel;
        var result = Math.min(Number(match[1]), max) || max;
        data.MPLevels.max = result;
    };

    VictorEngine.MPLevels.processValues2 = function (data, match) {
        var level = match[1];
        data.MPLevels[level] = data.MPLevels[level] || {};
        data.MPLevels[level].bonus = Number(match[2]);
    };

    VictorEngine.MPLevels.processValues3 = function (data, match) {
        var level = match[1];
        data.MPLevels[level] = data.MPLevels[level] || {};
        data.MPLevels[level].cost = Number(match[2]);
    };

    VictorEngine.MPLevels.processValues4 = function (data, match) {
        var level = match[1];
        data.MPLevels[level] = data.MPLevels[level] || {};
        data.MPLevels[level].max = Number(match[2]);
        data.MPLevels[level].growth = String(match[3]).trim();
    };

    VictorEngine.MPLevels.processValues5 = function (data, match) {
        var level = match[1];
        data.MPLevels[level] = data.MPLevels[level] || {};
        data.MPLevels[level].gain = String(match[2]).trim();
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    VictorEngine.MPLevels.applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
    Game_Action.prototype.applyItemUserEffect = function (target) {
        VictorEngine.MPLevels.applyItemUserEffect.call(this, target);
        var item = this.item();
        var max = VictorEngine.Parameters.MPLevels.MaxMPLevel;
        for (var level = 1; level <= max; level++) {
            var value = item.MPLevels[level];
            if (value && value.gain) {
                target.changeMpLevels(level, value.gain);
            }
        }
    };

    //=============================================================================
    // Game_BattlerBase
    //=============================================================================

    VictorEngine.MPLevels.refresh = Game_BattlerBase.prototype.refresh;
    Game_BattlerBase.prototype.refresh = function () {
        VictorEngine.MPLevels.refresh.call(this);
        this.refreshMpLevels();
    };

    VictorEngine.MPLevels.canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
    Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
        return VictorEngine.MPLevels.canPaySkillCost.call(this, skill) && this.canPaysSkillMpLevelCost(skill);
    };

    VictorEngine.MPLevels.paySkillCost = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function (skill) {
        VictorEngine.MPLevels.paySkillCost.call(this, skill);
        this.paySkillMpLevelCost(skill);
    };

    VictorEngine.MPLevels.recoverAll = Game_BattlerBase.prototype.recoverAll;
    Game_BattlerBase.prototype.recoverAll = function () {
        VictorEngine.MPLevels.recoverAll.call(this)
        this.setupMpLevel();
    };

    Game_BattlerBase.prototype.mpLevelValues = function () {
        var result = this._mpLevelValues.clone();
        var length = String(VictorEngine.Parameters.MPLevels.MaxMPValue).length;
        result.shift();
        return result.map(function (value) {
            return VictorEngine.replaceZeros(String(value.now).padZero(length), ' ');
        });
    };

    Game_BattlerBase.prototype.mpLevel = function (level) {
        var mpLevel = this._mpLevelValues[level] || {};
        return mpLevel.now || 0;
    };

    Game_BattlerBase.prototype.mmpLevel = function (level) {
        var mpLevel = this._mpLevelValues[level] || {};
        return mpLevel.max || 0;
    };

    Game_BattlerBase.prototype.refreshMpLevels = function () {
        var mpLevel = this._mpLevelValues;
        for (var level = 1; level < mpLevel.length; level++) {
            var max = this.setupMaxMpLevelValue(level);
            var now = this.mpLevel(level);
            mpLevel[level].max = max;
            mpLevel[level].now = now.clamp(0, max);
        };
    };

    Game_BattlerBase.prototype.canPaysSkillMpLevelCost = function (skill) {
        if (this.infiniteMpLevels()) {
            return true;
        } else {
            return this._mpLevelValues.every(function (value, level) {
                return this.canPayMpLevelCost(skill, level);
            }, this);
        }
    };

    Game_BattlerBase.prototype.canPayMpLevelCost = function (skill, level) {
        return this.mpLevel(level) >= this.skillMpLevelCost(skill, level);
    };

    Game_BattlerBase.prototype.skillMpLevelCost = function (skill, level) {
        var value = skill.MPLevels[level] || {};
        return (value.cost * this.mpLevelCostModifier(level)) || 0;
    };

    Game_BattlerBase.prototype.mpLevelCostModifier = function (level) {
        return this.traitObjects().reduce(function (r, data) {
            var value = data.MPLevels[level] || {}
            var result = 1 + (value.cost / 100 || 0);
            return r * result;
        }, 1);
    };

    Game_BattlerBase.prototype.paySkillMpLevelCost = function (skill) {
        if (!this.infiniteMpLevels()) {
            for (var level = 1; level < this._mpLevelValues.length; level++) {
                var value = this.skillMpLevelCost(skill, level);
                this.changeMpLevels(level, -value);
            };
        }
    };

    Game_BattlerBase.prototype.changeMpLevels = function (level, value) {
        this._mpLevelValues[level].now += value;
        this.refreshMpLevels();
    };

    Game_BattlerBase.prototype.changeMaxMpLevels = function (level, value) {
        this._mpLevelPoints[level] = this._mpLevelPoints[level] || 0;
        this._mpLevelPoints[level] += value;
    };

    Game_BattlerBase.prototype.setupMpLevel = function () {
        this._mpLevelValues = [];
        var mpLevel = this._mpLevelValues;
        var max = this.setupMaxMpLevel();
        for (var level = 1; level <= max; level++) {
            var value = this.setupMaxMpLevelValue(level);
            mpLevel[level] = {
                now: value,
                max: value
            };
        }
    };

    Game_BattlerBase.prototype.setupMaxMpLevel = function () {
        return this.traitObjects().reduce(function (r, data) {
            var result = data.MPLevels.max || 0;
            return r.concat(result);
        }, []).sort(function (a, b) {
            return b - a
        })[0] || 0;
    };

    Game_BattlerBase.prototype.setupMaxMpLevelValue = function (level) {
        var get = this.getMpLevelValues(level);
        var now = this.getMpLevelsValuesNow(get);
        var max = get.map(function (data) {
            return data.max || 0
        });
        var limit = VictorEngine.Parameters.MPLevels.MaxMPValue;
        now = now.sort(function (a, b) {
            return b - a
        })[0];
        max = max.sort(function (a, b) {
            return b - a
        })[0];
        now = now + (this._mpLevelPoints[level] || 0);
        return Math.floor(now.clamp(0, Math.min(max, limit))) || 0;
    };

    Game_BattlerBase.prototype.getMpLevelValues = function (level) {
        return this.traitObjects().reduce(function (r, data) {
            var result = data.MPLevels[level];
            return r.concat(result || []);
        }, []);
    };

    Game_BattlerBase.prototype.getMpLevelsValuesNow = function (get) {
        var object = this;
        return get.reduce(function (r, data) {
            var result = 0;
            var v = $gameVariables._data;
            var a = object;
            eval(data.growth);
            return r.concat(result);
        }, []);
    };

    Game_BattlerBase.prototype.infiniteMpLevels = function () {
        return this.traitObjects().some(function (data) {
            return data.MPLevels.infinite;
        }, []);
    };

    //=============================================================================
    // Game_Actor
    //=============================================================================

    VictorEngine.MPLevels.setupActor = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function (actorId) {
        this._mpLevelValues = [];
        this._mpLevelPoints = [];
        VictorEngine.MPLevels.setupActor.call(this, actorId);
        this.setupMpLevel();
    };

    //=============================================================================
    // Game_Enemy
    //=============================================================================

    VictorEngine.MPLevels.setupEnemy = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function (enemyId, x, y) {
        this._mpLevelValues = [];
        this._mpLevelPoints = [];
        VictorEngine.MPLevels.setupEnemy.call(this, enemyId, x, y);
        this.setupMpLevel();
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================

    VictorEngine.MPLevels.pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        VictorEngine.MPLevels.pluginCommand.call(this, command, args);
        if (command.toLowerCase() === 'gainmplevel') {
            var v = $gameVariables._data;
            if (args[0].toLowerCase() === 'actor') {
                var level = Number(eval(args[2]));
                var value = Number(eval(args[3]));
                var actor = $gameActors.actor(Number(eval(args[1])));
                if (actor) {
                    actor.changeMpLevels(level, value);
                }
            }
            if (args[0].toLowerCase() === 'party') {
                var level = Number(eval(args[2]));
                var value = Number(eval(args[3]));
                var actor = $gameParty.members()[Number(eval(args[1])) - 1];
                if (actor) {
                    actor.changeMpLevels(level, value);
                }
            }
        }
        if (command.toLowerCase() === 'maxmplevel') {
            var v = $gameVariables._data;
            if (args[0].toLowerCase() === 'actor') {
                var level = Number(eval(args[2]));
                var value = Number(eval(args[3]));
                var actor = $gameActors.actor(Number(eval(args[1])));
                if (actor) {
                    actor.changeMaxMpLevels(level, value);
                }
            }
            if (args[0].toLowerCase() === 'party') {
                var level = Number(eval(args[2]));
                var value = Number(eval(args[3]));
                var actor = $gameParty.members()[Number(eval(args[1])) - 1];
                if (actor) {
                    actor.changeMaxMpLevels(level, value);
                }
            }
        }
        if (command.toLowerCase() === 'recoverallmplevels') {
            $gameParty.members().forEach(function (actor) {
                actor.setupMpLevel();
            })
        }
    };

    //=============================================================================
    // Window_Base
    //=============================================================================

    VictorEngine.MPLevels.drawActorMp = Window_Base.prototype.drawActorMp;
    Window_Base.prototype.drawActorMp = function (actor, x, y, width) {
        if (VictorEngine.Parameters.MPLevels.ReplaceDisplay.toLowerCase() === 'mp') {
            this.drawActorMpLevels(actor, x, y);
        } else {
            VictorEngine.MPLevels.drawActorMp.call(this, actor, x, y, width);
        }
    };

    VictorEngine.MPLevels.drawActorTp = Window_Base.prototype.drawActorTp;
    Window_Base.prototype.drawActorTp = function (actor, x, y, width) {
        if (VictorEngine.Parameters.MPLevels.ReplaceDisplay.toLowerCase() === 'tp') {
            this.drawActorMpLevels(actor, x, y);
        } else {
            VictorEngine.MPLevels.drawActorTp.call(this, actor, x, y, width);
        }
    };

    Window_Base.prototype.drawActorMpLevels = function (actor, x, y) {
        var values = actor.mpLevelValues();
        var params = VictorEngine.Parameters.MPLevels;
        var result = params.MPDisplayFormat;
        var symbol = params.SeparatorSymbol;
        var length = String(params.MaxMPValue).length;
        var mpName = params.MPLevelName;
        var startX = x;
        var lines = 0
        this.drawTextEx(mpName, x, y);
        if (mpName) {
            x += this.textWidthEx(mpName) + 8;
        }
        if (values.length > 0) {
            for (var i = 0; i < values.length; i++) {
                this.resetFontSettings();
                var value = values[i];
                var level = i + 1;
                var icon = '\i[' + VictorEngine.MPLevels.levelIcons[i] + ']';
                var text = result.format(value, level, icon).trim();
                var adjust = String(0).padZero(length);
                this.resetFontSettings();
                this.drawTextEx(text, x, y);
                x += this.textWidthEx(result.format(adjust, level, icon).trim());
                if (i < values.length - 1) {
                    this.drawTextEx(symbol, x + 4, y);
                    x += this.textWidthEx(symbol) + 8;
                }
                if (params.LineBreak === ++lines) {
                    lines = 0;
                    x = startX;
                    y += this.contents.fontSize + this.textPadding();
                }
            }
        } else {
            var value = VictorEngine.replaceZeros(String(0).padZero(length), ' ');
            var icon = '\i[' + VictorEngine.MPLevels.levelIcons[0] + ']';
            var text = result.format(value, 1, icon).trim();
            this.drawTextEx(text, x, y);
        }
        this.resetFontSettings();
    };

    //=============================================================================
    // Window_SkillList
    //=============================================================================

    VictorEngine.MPLevels.drawSkillCost = Window_SkillList.prototype.drawSkillCost;
    Window_SkillList.prototype.drawSkillCost = function (skill, x, y, width) {
        var max = VictorEngine.Parameters.MPLevels.MaxMPLevel;
        for (var level = 1; level <= max; level++) {
            var cost = this._actor.skillMpLevelCost(skill, level);
            if (cost) {
                this.drawSkillMpLevelCost(cost, level, x, y, width);
                x -= this._mpLevelWidth + 16;
            }
        }
        VictorEngine.MPLevels.drawSkillCost.call(this, skill, x, y, width);
    };

    Window_SkillList.prototype.drawSkillMpLevelCost = function (cost, level, x, y, width) {
        var icon = '\i[' + VictorEngine.MPLevels.levelIcons[level - 1] + ']';
        var text = VictorEngine.Parameters.MPLevels.MPCostFormat.format(cost, level, icon).trim();
        this._mpLevelWidth = this.textWidthEx(text);
        this.drawTextEx(text, x + width - this._mpLevelWidth, y);
        this.resetFontSettings();
    };

})();