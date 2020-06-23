/*
 * ==============================================================================
 * ** Victor Engine MV - Element Set
 * ------------------------------------------------------------------------------
 *  VE_ElementSet.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Element Set'] = '1.03';

var VictorEngine = VictorEngine || {};
VictorEngine.ElementSet = VictorEngine.ElementSet || {};

(function () {

    VictorEngine.ElementSet.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        VictorEngine.ElementSet.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Element Set', 'VE - Basic Module', '1.20');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Element Set', 'VE - Damge Popup');
    };

    VictorEngine.ElementSet.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function (name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.ElementSet.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * @plugindesc v1.03 - Set more than one element to Skills and Items.
 * @author Victor Sant
 *
 * @param Element Multiplier
 * @desc Setup how multiple elements are handled.
 * Default: highest. (More information at the Help)
 * @default highest
 *
 * @help 
 * ==============================================================================
 *  Notetags:
 * ==============================================================================
 *
 * ==============================================================================
 *  Element Set (notetag for Skills and Items)
 * ------------------------------------------------------------------------------
 *  <element set: X[, X...]>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Setup the ID of the extra elements of the action.
 *    x : ID of the element.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <element set: 1>
 *       <element set: 1, 2, 3>
 * ==============================================================================
 *
 * ==============================================================================
 *  Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  The element set on the action damage section are still valid, the element
 *  is added to the list. If Normal Attack element is set, the attack elements
 *  are added to the extra elements.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  The plugin parameter 'Element Multiplier' allows to change how multiple
 *  element resistance are calculated. The following values can be set for it:
 *   highest  : use the highest multiplier. (default behavior)
 *   lowest   : use the lowest multiplier.
 *   addition : sum of all multiplier.
 *   average  : avarage of all multiplier.
 *   multiply : multiply all values.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Highest 
 *  If the battler have a 50% multiplier and a 125% multipler the result will
 *  be 125%. So it uses the weakest resistance.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Lowest 
 *  If the battler have a 50% multiplier and a 125% multipler the result will
 *  be 50%. So it uses the strongest resistance.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Addition
 *  Adds all multipliers. This option consider the base resistance being 100%
 *  and subtract 100 of the multiplier to that value before the addition.
 *  If the battler have a 50% multiplier and a 125% multipler the result will
 *  be 75%. 100 + (50 - 100) + (125 - 100) = 75.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Average
 *  Calculate the average all multipliers. If the battler have a 50% multiplier
 *  and a 125% multipler the result will be 87,5%. (50 + 125) / 2.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Multiply
 *  Multiply all multipliers value. It uses a base of 100% then multiple each
 *  value. If the battler have a 50% multiplier and a 125% multipler the result 
 *  will be 62,5%. 100% * 50% * 125% = 62,5%
 *
 * ==============================================================================
 * 
 * ==============================================================================
 *  Compatibility:
 * ------------------------------------------------------------------------------
 *  To be used together with this plugin, the following plugin must be placed
 *  bellow this plugin:
 *     VE - Damge Popup
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.01.04 > First release
 *  v 1.01 - 2016.04.21 > Compatibility with Damge Popup.
 *  v 1.02 - 2016.05.14 > Fixed issue that made the plugin nor work.
 *  v 1.03 - 2020.05.15 > Fixed issue that made the plugin nor work
 *                        by Dark Plasma.
 * ==============================================================================
 */
/*:ja
 * @plugindesc v1.03 スキルやアイテムに複数の属性を設定でき、全体の属性の計算方法を変更できます
 * @author Victor Sant
 *
 * @param Element Multiplier
 * @text 属性計算方法
 * @type select
 * @option 最高
 * @value highest
 * @option 最低
 * @value lowest
 * @option 合計
 * @value addition
 * @option 平均
 * @value average
 * @option 乗算
 * @value multiply
 * @desc 複数の属性の計算方法
 * 詳細はヘルプ参照。デフォルト: highest(最高)
 * @default highest
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:(本プラグインはDark Plasma氏によりバグ修正されています)
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/element-set/
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
 *  スキル・アイテムのメモタグ
 * ---------------------------------------------------------------------------
 *  <element set: X[, X...]>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  アクションの追加属性のIDを設定します。
 *    x : 属性ID
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例: <element set: 1>
 *      <element set: 1, 2, 3>
 *
 *
 * ===========================================================================
 *  追加情報
 * ===========================================================================
 *
 * アクションダメージ部に設定されている属性が有効なままであれば、
 * その属性がリストに追加されます。
 * 通常攻撃属性が設定されている場合、
 * 攻撃属性が追加されます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * プラグインのパラメータ'Element Multiplier'では、
 * 複数の属性の有効度値の計算方法を変更することができます。
 * 設定できる値は以下の通りです。
 *
 *   highest  : 全有効度の最高値を使用 (デフォルト動作)
 *   lowest   : 全有効度の最低値を使用
 *   addition : 全有効度の合計値
 *   average  : 全有効度の平均値
 *   multiply : 全有効度の乗算値
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Highest (最高)
 * バトラーが50%の有効度と125%の有効度を持っている場合、結果は125%になります。
 * よって、一番弱い有効度を使います。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Lowest (最低)
 * バトラーが50%の有効度と125%の有効度を持っている場合、結果は50%になります。
 * よって、最強の有効度を使います。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Addition (合計)
 * 全ての有効度を加算します。
 * このオプションは基本有効度を100%とみなし、
 * その値に100の有効度を引いてから加算します。
 * バトラーが50%の有効度と125%の有効度を持っている場合、結果は75%になります。
 *
 * 100 + (50 - 100) + (125 - 100) = 75
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Average (平均)
 * 全ての有効度の平均します。
 * バトラーの有効度が50%で有効度が125%の場合、
 * 結果は87.5%になります。
 *
 * (50 + 125) / 2 = 87.5
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Multiply (乗算)
 * 全ての有効度の値を乗算します。
 * 100%をベースにして、各値を乗算します。
 * バトラーに50%の有効度と125%の有効度がある場合、結果は62,5%になります。
 *
 * 100% * 50% * 125% = 62.5%
 *
 *
 * ===========================================================================
 *  互換性
 * ===========================================================================
 *
 * 以下のプラグインと併用するには、本プラグインを下に配置する必要があります。
 * - VE_DamgePopup
 *
 * ===========================================================================
 *  Version History:
 * ===========================================================================
 *  v 1.00 - 2016.01.04 > First release
 *  v 1.01 - 2016.04.21 > Compatibility with Damge Popup.
 *  v 1.02 - 2016.05.14 > Fixed issue that made the plugin nor work.
 *  v 1.03 - 2020.05.15 > Fixed issue that made the plugin nor work
 *                        by Dark Plasma.
 */

(function () {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.ElementSet = {};
        VictorEngine.Parameters.ElementSet.Multiplier = String(parameters["Element Multiplier"]);
    };

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.ElementSet.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function (data, index) {
        VictorEngine.ElementSet.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['skill', 'item'])) {
            VictorEngine.ElementSet.loadNotes(data);
        }
    };

    VictorEngine.ElementSet.getAllElements = VictorEngine.getAllElements;
    // VictorEngine.getAllElements = function (subject, item) {
    //     var result = VictorEngine.ElementSet.getAllElements.call(this, subject, item);
    //     return result.concat(item.elementSet);
    // };

    // start bug fix by Dark Plasma
    VictorEngine.getAllElements = function (subject, action) {
        var result = VictorEngine.ElementSet.getAllElements.call(this, subject, action);
        return result.concat(action.item().elementSet);
    };
    // end bug fix by Dark Plasma

    VictorEngine.ElementSet.loadNotes = function (data) {
        data.elementSet = data.elementSet || [];
        this.processNotes(data);
    };

    VictorEngine.ElementSet.processNotes = function (data) {
        var match;
        var regex = new RegExp('<element set:[ ]*((?:\\d+[ ]*,?[ ]*)+)[ ]*>', 'gi');
        while (match = regex.exec(data.note)) {
            this.processValues(data, match);
        };
    };

    VictorEngine.ElementSet.processValues = function (data, match) {
        data.elementSet = match[0].split(/[ ]*,[ ]*/gi).map(function (value) {
            return Number(value);
        });
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    VictorEngine.ElementSet.calcElementRate = Game_Action.prototype.calcElementRate;
    Game_Action.prototype.calcElementRate = function (target) {
        // elements = VictorEngine.getAllElements(this.subject(), this.item())
        elements = VictorEngine.getAllElements(this.subject(), this);   //  bug fix by Dark Plasma
        if (elements.length > 1) {
            return this.elementsMaxRate(target, elements)
        } else {
            return VictorEngine.ElementSet.calcElementRate.call(this, target);
        }
    };

    VictorEngine.ElementSet.elementsMaxRate = Game_Action.prototype.elementsMaxRate;
    Game_Action.prototype.elementsMaxRate = function (target, elements) {
        switch (VictorEngine.Parameters.ElementSet.Multiplier.toLowerCase()) {
            case 'lowest':
                return this.elementMinRate(target, elements);
            case 'addition':
                return this.elementAddRate(target, this.uniqElements(elements));
            case 'average':
                return this.elementAvgRate(target, this.uniqElements(elements));
            case 'multiply':
                return this.elementMltRate(target, this.uniqElements(elements));
            default:
                return VictorEngine.ElementSet.elementsMaxRate.call(this, target, elements);
        }
    };

    Game_Action.prototype.uniqElements = function (elements) {
        return elements.filter(function (element, index) {
            return elements.indexOf(element) === index;
        })
    };

    Game_Action.prototype.elementMinRate = function (target, elements) {
        return Math.min.apply(null, elements.map(function (elementId) {
            return target.elementRate(elementId);
        }, this));
    };

    Game_Action.prototype.elementAddRate = function (target, elements) {
        return elements.reduce(function (r, elementId) {
            return r + (target.elementRate(elementId) - 1);
        }, 1);
    };

    Game_Action.prototype.elementAvgRate = function (target, elements) {
        return elements.reduce(function (r, elementId) {
            return r + (target.elementRate(elementId) / elements.length);
        }, 0);
    };

    Game_Action.prototype.elementMltRate = function (target, elements) {
        return elements.reduce(function (r, elementId) {
            return r * target.elementRate(elementId);
        }, 1);
    };

})();