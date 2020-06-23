/*
 * ==============================================================================
 * ** Victor Engine MV - Hit Formula
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.12.18 > First release.
 *  v 1.01 - 2015.12.21 > Compatibility with Basic Module 1.04.
 *  v 1.02 - 2016.02.15 > Compatibility with Battle Advantage.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Hit Formula'] = '1.02';

var VictorEngine = VictorEngine || {};
VictorEngine.HitFormula = VictorEngine.HitFormula || {};

(function () {

	VictorEngine.HitFormula.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.HitFormula.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Hit Formula', 'VE - Basic Module', '1.06');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Hit Formula', 'VE - Battle Advantage');
	};

	VictorEngine.HitFormula.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.HitFormula.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.02 - Setup different formulas for action hit success.
 * @author Victor Sant
 *
 * @param Default Formula
 * @desc Setup a default hit formula. Similar to the damage formula.
 * leave empty for no formula
 * @default @@
 *
 * @help 
 * ------------------------------------------------------------------------------
 * Skills and Items Notetags:
 * ------------------------------------------------------------------------------
 *  
 * <hit formula>
 *  result = code
 * <hit formula>
 *   Change the the hit formula of the action.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "b" for the target, "v[x]" for variable and "item" for the item
 *  object. In addition to that, you can use 'hit' for the user hit and 'eva' for
 *  the target evasion. "hit" and "eva" don't need to be assigned to the user or
 *  target, "hit" is always for the user and "eva" is always for the target.
 *
 *  The result must return a numeric value from 0 to 100. Any value beyond this
 *  range is redundant.
 *
 *  If you want your action to have a true/false statement, make it so the plugin
 *  checks for the condition, then return 100 or 0. For example, if you want your
 *  action to hit if a switch is ON and miss if it's Off, then do something like:
 *  '$gameSwitches.value(1) ? 100 : 0'
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 * <hit formula>
 *  result = hit - eva
 * </hit formula>
 *  This one will compare check if the hit rate minus the target eva is lower
 *  than a random value. So a 125% hit against 45% eva will result in 80% hit
 *
 * ---------------
 *
 * <hit formula>
 *  if (b.level % 5 === 0) {
 *      result = 100
 *  } else {
 *      result = 0	 
 *  }
 * </hit formula>
 *  This will make the famous "level 5" skills from FF, where the skill hits
 *  if the target level is divisible by 5. Remember that by default, enemies
 *  don't have level so this would work only for actors unless you manage
 *  to give levels to enemies.
 *
 * ---------------
 *
 * <hit formula>
 *  result = hit * Math.min(255, Math.max(1, (255 - eva * 2) + 1) / 256
 * </hit formula>
 *  This reproduce the hit formula from FF6.
 *
 * ------------------------------------------------------------------------------
 *
 * Compatibility:
 * - When used together with the plugin 'VE - Battle Advantage', place this
 *   plugin above it.
 */
/*:ja
 * @plugindesc v1.02 スキル・アイテム毎の命中率に式が使えます。
 * @author Victor Sant
 *
 * @param Default Formula
 * @text デフォルト命中式
 * @desc デフォルトの命中式です。ダメージ式と似ています。
 * 式がない場合、無入力
 * @default @@
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/hit-formula/
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
 * スキル、アイテムのメモタグ
 * ---------------------------------------------------------------------------
 *
 * <hit formula>
 *  result = code
 * <hit formula>
 *
 * アクションの命中式を変更します。
 *
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 * コードはダメージ式と同じ値を使っているので、使用者には'a'、対象には'b'、
 * 変数には'v[x]'、アイテムオブジェクトには'item'を使うことができます。
 * さらに、使用者の命中には'hit'、対象の回避には'eva'を使うことができます。
 * 'hit'と'eva'は使用者や対象に割り当てる必要はなく、
 * 'hit'は常に使用者に、'eva'は常に対象に割り当てられています。
 *
 * 結果は0から100までの数値を返す必要があります。
 * この範囲を超える値は冗長です。
 *
 * アクションにTrue/False文を持たせたい場合、
 * プラグインが条件をチェックして100か0を返すようにします。
 * 例えば、スイッチID1がONの時は命中し、
 * OFFの時はミスするようにしたい場合、次のようにします。
 *
 * <hit formula>
 *  result = $gameSwitches.value(1) ? 100 : 0
 * </hit formula>
 *
 *
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 * <hit formula>
 *  result = hit - eva
 * </hit formula>
 *
 * 命中率から目標の回避率を引いた値がランダムな値よりも低いかどうかを比較します。
 * つまり、45%の回避率に対して125%の命中率であれば、
 * 80%の命中率になります。
 *
 * ---------------
 *
 * <hit formula>
 *  if (b.level % 5 === 0) {
 *      result = 100
 *  } else {
 *      result = 0
 *  }
 * </hit formula>
 *
 * FFの有名な'レベル5'というスキルができるようになります。
 * デフォルトでは敵はレベルを持っていないので、
 * 敵にレベルを与えない限りはアクターにしか機能しません。
 *
 * ---------------
 *
 * <hit formula>
 *  result = hit * Math.min(255, Math.max(1, (255 - eva * 2) + 1) / 256
 * </hit formula>
 *
 * FF6の命中式を再現しています。
 *
 *
 * ---------------------------------------------------------------------------
 * 互換性
 * ---------------------------------------------------------------------------
 * 'VE_BattleAdvantage'プラグインと併用する場合、
 * このプラグインを上に配置してください。
 */

(function () {

	//=============================================================================
	// Parameters
	//=============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.HitFormula = {};
		VictorEngine.Parameters.HitFormula.DefaultFormula = String(parameters["Default Formula"]).trim();
	};

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.HitFormula.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.HitFormula.loadNotetagsValues.call(this, data, index);
		var list = ['skill', 'item'];
		if (this.objectSelection(index, list)) VictorEngine.HitFormula.loadNotes(data);
	};


	VictorEngine.HitFormula.loadNotes = function (data) {
		data.hitFormula = data.hitFormula || null;
		this.processNotes(data);
	};

	VictorEngine.HitFormula.processNotes = function (data) {
		var match;
		var regex = VictorEngine.getNotesValues('hit formula');
		while ((match = regex.exec(data.note)) !== null) { data.hitFormula = match[1].trim() };
	};

	//=============================================================================
	// Game_Action
	//=============================================================================

	VictorEngine.HitFormula.itemHit = Game_Action.prototype.itemHit;
	Game_Action.prototype.itemHit = function (target) {
		if (this.getHitFormula()) {
			return 1;
		} else {
			return VictorEngine.HitFormula.itemHit.call(this, target);
		}
	};

	VictorEngine.HitFormula.itemEva = Game_Action.prototype.itemEva;
	Game_Action.prototype.itemEva = function (target) {
		if (this.getHitFormula()) {
			return Math.random() < this.getHitResult(target) ? 0 : 1;
		} else {
			return VictorEngine.HitFormula.itemEva.call(this, target);
		}
	};

	Game_Action.prototype.getHitResult = function (target) {
		try {
			var result = 0;
			var item = this.item();
			var a = this.subject();
			var b = target;
			var v = $gameVariables._data;
			var hit = VictorEngine.HitFormula.itemHit.call(this, target) * 100;
			var eva = VictorEngine.HitFormula.itemEva.call(this, target) * 100;
			eval(this.getHitFormula());
			return (Number(result) / 100) || 0;
		} catch (e) {
			return 0;
		}
	};

	Game_Action.prototype.getHitFormula = function () {
		return this.item().hitFormula || VictorEngine.Parameters.HitFormula.DefaultFormula;
	};

})();