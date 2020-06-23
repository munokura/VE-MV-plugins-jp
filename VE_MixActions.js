/*
 * ==============================================================================
 * ** Victor Engine MV - Mix Actions
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.01.07 > First release.
 *  v 1.01 - 2016.01.14 > Fixed issue with using items outside of battle.
 *  v 1.02 - 2016.01.18 > Added function to get mix Items for damage formulas.
 *  v 1.03 - 2016.02.02 > Added hidden setup (Compatibility with Command Replace)
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Mix Actions'] = '1.03';

var VictorEngine = VictorEngine || {};
VictorEngine.MixActions = VictorEngine.MixActions || {};

(function () {

	VictorEngine.MixActions.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.MixActions.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Mix Actions', 'VE - Basic Module', '1.09');
	};

	VictorEngine.MixActions.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.MixActions.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.03 - Combine actions to create a new action.
 * @author Victor Sant
 *
 * @param Default Failure
 * @desc Default skill used when a mix fails.
 * Default: 2. (skill Id)
 * @default 2
 *
 * @help 
 * ------------------------------------------------------------------------------
 * Actors, Classes, Weapons, Armors and States Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <mix command: 'command name'>
 *   selection 1: item X
 *   selection 2: item X, item Y
 *   failure: skill X
 *   hidden
 *   item X + item X = skill X
 *   item Y + item Z = skill Y
 *  </mix command>
 *   This tag adds the mix command to the actor.
 *   This setup is rather complex. it's divided on hidden parts:
 *   command name, selection, failure, combinations, hidden
 *
 * ---------------
 *
 *   - Command Name
 *   The easiest setup, set the name of the mix command displayed on the
 *   actor command window. Must be always inside quotations.
 *
 * ---------------
 *
 *   - Selection
 *   Setup wich items or skills will be available to choose. You can setup
 *   items, skills, armors, weapons, item types, skill types, armor types and
 *   weapon types. You can add as many options you want.
 *     item x   : the item ID x will be available for combining.
 *     skill x  : the skill ID x will be available for combining.
 *     armor x  : the armor ID x will be available for combining.
 *     weapon x : the weapon ID x will be available for combining.
 *     itype x  : the items with type ID x will be available for combining.
 *     stype x  : the skills with type ID x will be available for combining.
 *     atype x  : the armors with type ID x will be available for combining.
 *     wtype x  : the weapons with type ID x will be available for combining.
 *      Ex.: selection 1: itype 1
 *           selection 2: stype 2, item 1, skill 1
 *
 * ---------------
 *
 *   - Failure
 *   Setup the id of the skill used when the mix combination result don't
 *   exist. If this value is not set, the game will use the value set
 *   on the plugin paramenter 'Default Failure'.
 *
 * ---------------
 *
 *   - Hidden
 *   Setup the id of the skill used when the mix combination result don't
 *   exist. If this value is not set, the game will use the value set
 *   on the plugin paramenter 'Default Failure'.
 *
 * ---------------
 *
 *   - Combination
 *   Setup the item combinations and the id of the resulting skill. No matter
 *   what is combined, the result must always be a skill. You can setup
 *   items, skills, armors and weapons as the component and a skill as the
 *   result. The number of actions must be always the same as the number of
 *   selections available.
 *     item x   : the item ID x will be available for combining.
 *     skill x  : the skill ID x will be available for combining.
 *     armor x  : the armor ID x will be available for combining.
 *     weapon x : the weapon ID x will be available for combining.
 *      Ex.: item 1 + item 1 = skill 10
 *           skill 10 + skill 11 = skill 12
 *           item 1 + item 2 + item 3 = skill 15
 *           skill 10 + weapon 5 = skill 20
 *
 *   You can use a shorter form for the setup instead of using the complete name
 *   for the selection and combination settings.
¨*   Use the following shorter form to replace the long forms:
 *     i  : item
 *     s  : skill
 *     a  : armor
 *     w  : weapon
 *     it : itype
 *     st : stype
 *     at : atype
 *     wt : wtype
 *      EX.: item 3 can be replaced with i3
 *           weapon 5 can be replaced with w5
 *           atype 3 can be replaced with at3
 *
 * ------------------------------------------------------------------------------
 * Weapons and Armors  Notetags:
 * ------------------------------------------------------------------------------
 *  
 *  <mix consumable>
 *   Weapons and armors with this tag will be consumed when used as component
 *   for the mix. Otherwise it will not be consumed
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  This plugin require a heavy setup. There are no shortcuts or automated ways
 *  to make the setup. You must setup each valid combination manually.
 *
 * ---------------
 *
 *  The order you setup the items for the combinations doesn't matter.
 *  If you set a mix to be "item 1 + item 2 = skill 3", even if the player 
 *  combine "item 2 + item 1" the result will be the same.
 *
 * ---------------
 *
 *  You can use the code 'this.mixItem(X)' to get retrieve the items used on
 *  the mix. For example, this.mixItem(1) will retrieve first mix item.
 *  You can use that to use the mix item parameter on the formula.
 *  This code gets the item sorted, so it might not be the same order as the
 *  items were input on the window.
 *
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <mix command: 'Mix Long Sample'>
 *  selection 1: itype 1
 *  selection 2: itype 1
 *  failure: skill 9
 *  item 1 + item 1 = skill 10
 *  item 1 + item 2 = skill 11
 *  item 1 + item 3 = skill 13
 *  item 2 + item 3 = skill 14
 *  </mix command>
 *
 * ---------------
 *
 *  <mix command: 'Mix Short Sample'>
 *  selection 1: it1
 *  selection 2: it1
 *  failure: s9
 *  i1 + i1 = s10
 *  i1 + i2 = s11
 *  i1 + i3 = s13
 *  i2 + i3 = s14
 *  </mix command>
 *
 * ---------------
 *
 *  <mix command: 'Mix Custom Sample'>
 *  selection 1: st1
 *  selection 2: st2
 *  selection 3: st3
 *  failure: s10
 *  s10 + s20 + s30 = s40
 *  s11 + s20 + s30 = s41
 *  s12 + s20 + s30 = s42
 *  s10 + s21 + s30 = s43
 *  s11 + s21 + s30 = s44
 *  s12 + s21 + s30 = s45
 *  s10 + s22 + s30 = s46
 *  s11 + s22 + s30 = s47
 *  s12 + s22 + s30 = s48
 *  s10 + s20 + s31 = s49
 *  s11 + s20 + s31 = s50
 *  s12 + s20 + s31 = s51
 *  s10 + s21 + s31 = s52
 *  s11 + s21 + s31 = s53
 *  s12 + s21 + s31 = s54
 *  s10 + s22 + s31 = s55
 *  s11 + s22 + s31 = s56
 *  s12 + s22 + s31 = s57
 *  s10 + s20 + s32 = s58
 *  s11 + s20 + s32 = s59
 *  s12 + s20 + s32 = s60
 *  s10 + s21 + s32 = s61
 *  s11 + s21 + s32 = s62
 *  s12 + s21 + s32 = s63
 *  s10 + s22 + s32 = s64
 *  s11 + s22 + s32 = s65
 *  s12 + s22 + s32 = s66
 *  </mix command>
 *
 */
/*:ja
 * @plugindesc v1.03 戦闘中のアクターコマンドに合成スキルコマンドを追加します
 * @author Victor Sant
 *
 * @param Default Failure
 * @text 失敗時スキル
 * @type skill
 * @desc 合成に失敗した時に使用するデフォルトのスキルID
 * デフォルト: 2
 * @default 2
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/mix-actions/
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
 *  <mix command: 'command name'>
 *   selection 1: item X
 *   selection 2: item X, item Y
 *   failure: skill X
 *   hidden
 *   item X + item X = skill X
 *   item Y + item Z = skill Y
 *  </mix command>
 *   このタグは、アクターに合成スキルコマンドを追加します。
 *   この設定はかなり複雑です。
 *   下記の5つの定義があります。
 *   command name, selection, failure, combinations, hidden
 *
 * ---------------
 *
 *   - Command Name (コマンド名)
 * 最も簡単な設定は、アクターコマンドウィンドウに表示される
 * 合成コマンドの名前を設定することです。
 * 常に引用符で囲まれている必要があります。
 *
 * ---------------
 *
 *   - Selection （選択肢）
 * 選択できるアイテムやスキルの種類を設定します。
 * アイテム、スキル、防具、武器、アイテムタイプ、スキルタイプ、防具タイプ、
 * 武器タイプを設定することができます。
 * 好きなだけオプションを追加することができます。
 *     item x   : アイテムIDxが組み合わせ可能になります。
 *     skill x  : スキルIDxが組み合わせ可能になります。
 *     armor x  : 防具IDxが組み合わせ可能になります。
 *     weapon x : 武器IDxが組み合わせ可能になります。
 *     itype x  : アイテムタイプIDxが組み合わせ可能になります。
 *     stype x  : スキルタイプIDxが組み合わせ可能になります。
 *     atype x  : 防具IDxが組み合わせ可能になります。
 *     wtype x  : 武器タイプIDxが組み合わせ可能になります。
 *      例 : selection 1: itype 1
 *           selection 2: stype 2, item 1, skill 1
 *
 * ---------------
 *
 *   - Failure （失敗）
 * 組み合わせ結果が存在しない場合、
 * 使用するスキルのIDを設定します。
 * この値が設定されていない場合、
 * プラグインのパラメータ'Default Failure'に設定されている値が使用されます。
 *
 * ---------------
 *
 *   - Hidden （未発見）
 * 組み合わせ結果が存在しない場合、
 * 使用するスキルのIDを設定します。
 * この値が設定されていない場合、
 * プラグインのパラメータ'Default Failure'に設定されている値が使用されます。
 *
 * ---------------
 *
 *   - Combination （組み合わせ）
 * アイテムの組み合わせと結果のスキルのIDを設定します。
 * 何を組み合わせても結果は必ずスキルになります。
 * アイテム、スキル、防具、武器を構成要素として、
 * 結果としてスキルを設定することができます。
 * アクションの数は常に選択可能な数と同じでなければなりません。
 *     item x   : アイテムIDxが組み合わせ可能になります。
 *     skill x  : スキルIDxが組み合わせ可能になります。
 *     armor x  : 防具IDxが組み合わせ可能になります。
 *     weapon x : 武器IDxが組み合わせ可能になります。
 *      例 : item 1 + item 1 = skill 10
 *           skill 10 + skill 11 = skill 12
 *           item 1 + item 2 + item 3 = skill 15
 *           skill 10 + weapon 5 = skill 20
 *
 * 選択肢と組み合わせの設定に完全な名前を使用する代わりに、
 * 短い書式を使用して設定することができます。
 * 長い書式の代わりに、次の短い書式を使用します。
 *     i  : アイテム
 *     s  : スキル
 *     a  : 防具
 *     w  : 武器
 *     it : アイテムタイプ
 *     st : スキルタイプ
 *     at : 防具
 *     wt : 武器タイプ
 *      例 : item 3 は i3 と書けます。
 *           weapon 5 は w5 と書けます。
 *           atype 3 は at3 と書けます。
 *
 * ---------------------------------------------------------------------------
 * 武器と防具のメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <mix consumable>
 * このタグが付いた武器や防具は、合成の要素として使用された場合、
 * 消費されます。
 * それ以外の場合は消費されません。
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 * このプラグインは重い設定が必要です。
 * 近道や自動で設定する方法はありません。
 * それぞれの有効な組み合わせを手動で設定する必要があります。
 *
 * ---------------
 *
 * 組み合わせにアイテムを設定する順番は関係ありません。
 * 'item 1 + item 2 = skill 3'と設定した場合、
 * プレイヤーが'item 2 + item 1'を組み合わせても結果は同じになります。
 *
 * ---------------
 *
 * 'this.mixItem(X)'というコードを使うと、
 * 合成に使われているアイテムを取得することができます。
 * 例えば、this.mixItem(1)は最初の合成アイテムを取得します。
 * これを使って、式の合成アイテムパラメータを使用することができます。
 * このコードはアイテムをソートして取得するので、
 * ウィンドウ上で入力されたアイテムと同じ順番ではないかもしれません。
 *
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 *  <mix command: 'Mix Long Sample'>
 *  selection 1: itype 1
 *  selection 2: itype 1
 *  failure: skill 9
 *  item 1 + item 1 = skill 10
 *  item 1 + item 2 = skill 11
 *  item 1 + item 3 = skill 13
 *  item 2 + item 3 = skill 14
 *  </mix command>
 *
 * ---------------
 *
 *  <mix command: 'Mix Short Sample'>
 *  selection 1: it1
 *  selection 2: it1
 *  failure: s9
 *  i1 + i1 = s10
 *  i1 + i2 = s11
 *  i1 + i3 = s13
 *  i2 + i3 = s14
 *  </mix command>
 *
 * ---------------
 *
 *  <mix command: 'Mix Custom Sample'>
 *  selection 1: st1
 *  selection 2: st2
 *  selection 3: st3
 *  failure: s10
 *  s10 + s20 + s30 = s40
 *  s11 + s20 + s30 = s41
 *  s12 + s20 + s30 = s42
 *  s10 + s21 + s30 = s43
 *  s11 + s21 + s30 = s44
 *  s12 + s21 + s30 = s45
 *  s10 + s22 + s30 = s46
 *  s11 + s22 + s30 = s47
 *  s12 + s22 + s30 = s48
 *  s10 + s20 + s31 = s49
 *  s11 + s20 + s31 = s50
 *  s12 + s20 + s31 = s51
 *  s10 + s21 + s31 = s52
 *  s11 + s21 + s31 = s53
 *  s12 + s21 + s31 = s54
 *  s10 + s22 + s31 = s55
 *  s11 + s22 + s31 = s56
 *  s12 + s22 + s31 = s57
 *  s10 + s20 + s32 = s58
 *  s11 + s20 + s32 = s59
 *  s12 + s20 + s32 = s60
 *  s10 + s21 + s32 = s61
 *  s11 + s21 + s32 = s62
 *  s12 + s21 + s32 = s63
 *  s10 + s22 + s32 = s64
 *  s11 + s22 + s32 = s65
 *  s12 + s22 + s32 = s66
 *  </mix command>
 *
 */

(function () {

	//=============================================================================
	// Parameters
	//=============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.MixActions = {};
		VictorEngine.Parameters.MixActions.DefaultFailure = Number(parameters["Default Failure"]) || 1;
	};

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.MixActions.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.MixActions.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'state', 'weapon', 'armor'];
		if (this.objectSelection(index, list)) VictorEngine.MixActions.loadNotes1(data);
		var list = ['weapon', 'armor'];
		if (this.objectSelection(index, list)) VictorEngine.MixActions.loadNotes2(data);
	};

	VictorEngine.MixActions.loadNotes1 = function (data, type) {
		data.mixActions = data.mixActions || [];
		this.processNotes1(data);
		if (type === 'equip') this.processEquipNotes(data);
	};

	VictorEngine.MixActions.loadNotes2 = function (data, type) {
		data.mixActions = data.mixActions || [];
		this.processNotes2(data);
	};

	VictorEngine.MixActions.processNotes1 = function (data) {
		var match;
		var regex = VictorEngine.getNotesValues("mix command:[ ]*('[^\']+'|\"[^\"]+\")[ ]*", "mix command");
		while ((match = regex.exec(data.note)) !== null) { this.processValues(data, match) };
	};

	VictorEngine.MixActions.processNotes2 = function (data) {
		var regex = new RegExp('<mix consumable>', 'gi');
		data.mixConsumable = !!regex.exec(data.note);
	};

	VictorEngine.MixActions.processValues = function (data, match) {
		var result = {};
		result.name = String(match[1].slice(1, -1));
		this.processOptions(result, match[2]);
		this.processFailure(result, match[2]);
		this.processResults(result, match[2]);
		this.processHideMix(result, match[2]);
		data.mixActions.push(result);
	};

	VictorEngine.MixActions.processOptions = function (data, match) {
		data.selection = [];
		var value;
		var regex = new RegExp('selection[ ]*(\\d+):[ ]*((?:\\w+[ ]*\\d+[ ]*,?[ ]*)+)', 'gi');
		while ((value = regex.exec(match)) !== null) { this.processOptionsValues(data, value) }
		data.selection.sort(function (a, b) { return a.id - b.id });
	};

	VictorEngine.MixActions.processFailure = function (data, match) {
		var value;
		var regex = new RegExp('failure:[ ]*(?:skill|s)[ ]*(\\d+)', 'gi');
		while ((value = regex.exec(match)) !== null) { data.failure = Number(value[1]) }
	};

	VictorEngine.MixActions.processHideMix = function (data, match) {
		var regex = new RegExp('hidden[^:]', 'gi');
		data.hidden = !!regex.exec(match)
	};

	VictorEngine.MixActions.processResults = function (data, match) {
		data.results = [];
		var value;
		var part1 = '((?:\\w+[ ]*\\d+[ ]*\\+?[ ]*)+)';
		var part2 = '=[ ]*(?:skill|s)[ ]*(\\d+)';
		var regex = new RegExp(part1 + part2, 'gi');
		while ((value = regex.exec(match)) !== null) { this.processResultsValues(data, value) };
	};

	VictorEngine.MixActions.processOptionsValues = function (data, match) {
		var value;
		var result = {};
		var part1 = '(item|skill|armor|weapon|itype|stype|atype|wtype|i|s|a|w|it|st|at|wt)';
		var regex = new RegExp(part1 + '[ ]*(\\d+)', 'gi');
		result.id = Number(match[1]);
		result.values = [];
		while ((value = regex.exec(match[2])) !== null) {
			var obj = {};
			obj.type = this.processType(value[1]);
			obj.id = Number(value[2]);
			result.values.push(obj);
		}
		data.selection.push(result)
	};

	VictorEngine.MixActions.processResultsValues = function (data, match) {
		var value;
		var result = {};
		var regex = new RegExp('(item|skill|armor|weapon|i|s|a|w)[ ]*(\\d+)', 'gi');
		result.id = Number(match[2]);
		result.values = [];
		while ((value = regex.exec(match[1])) !== null) {
			var obj = {};
			obj.type = this.processType(value[1]);
			obj.id = Number(value[2]);
			result.values.push(obj)
		}
		result.values.sort(function (a, b) {
			if (a.type === b.type) {
				return a.id - b.id;
			} else {
				var p1 = (a.type === 'i') ? 1 : (a.type === 's') ? 2 : (a.type === 'w') ? 3 : 4;
				var p2 = (b.type === 'i') ? 1 : (b.type === 's') ? 2 : (b.type === 'w') ? 3 : 4;
				return p1 - p2;
			}
		});
		data.results.push(result);
	};

	VictorEngine.MixActions.processType = function (value) {
		switch (value.toLowerCase()) {
			case 'item':
				return 'i';
			case 'skill':
				return 's';
			case 'armor':
				return 'a';
			case 'weapon':
				return 'w'
			case 'itype':
				return 'it';
			case 'stype':
				return 'st';
			case 'atype':
				return 'at';
			case 'wtype':
				return 'wt'
			default:
				return value.toLowerCase();
		}
	};

	//=============================================================================
	// Game_Action
	//=============================================================================

	VictorEngine.MixActions.clear = Game_Action.prototype.clear;
	Game_Action.prototype.clear = function () {
		VictorEngine.MixActions.clear.call(this)
		this._mixAction = [];
	};

	VictorEngine.MixActions.isValid = Game_Action.prototype.isValid;
	Game_Action.prototype.isValid = function () {
		var result = VictorEngine.MixActions.isValid.call(this);
		if (this.isMixAction()) {
			return result && this.subject().isValidMix(this.mixAction());
		} else {
			return result;
		}
	};

	Game_Action.prototype.setMix = function (mix) {
		this._mixAction = mix;
	};

	Game_Action.prototype.mixAction = function () {
		return this._mixAction
	};

	Game_Action.prototype.isMixAction = function () {
		return this._mixAction.length > 0;
	};

	Game_Action.prototype.mixItem = function (index) {
		var obj = this.mixAction()[index - 1]
		return obj ? this.subject().getMixItem(obj) : null;
	};

	//=============================================================================
	// Game_Battler
	//=============================================================================

	VictorEngine.MixActions.useItem = Game_Battler.prototype.useItem;
	Game_Battler.prototype.useItem = function (item) {
		if (this.currentAction() && this.currentAction().isMixAction()) {
			this.useMixItem();
		} else {
			VictorEngine.MixActions.useItem.call(this, item);
		}
	};

	Game_Battler.prototype.useMixItem = function () {
		action = this.currentAction();
		action.mixAction().forEach(function (obj) {
			var item = this.getMixItem(obj)
			if (DataManager.isSkill(item)) {
				this.paySkillCost(item);
			} else if (DataManager.isItem(item)) {
				this.consumeItem(item);
			} else if (item && item.mixConsumable) {
				this.consumeEquip(item);
			}
		}, this)
	};

	Game_Battler.prototype.consumeEquip = function (item) {
		$gameParty.consumeEquip(item);
	};

	Game_Battler.prototype.isValidMix = function (mix, item) {
		return this.canUseMix(mix, item) && this.canPayMix(mix, item);
	};

	Game_Battler.prototype.canUseMix = function (mix, item) {
		var mixValues = mix.clone();
		if (item) mixValues.push(this.getMixObject(item))
		return mixValues.every(function (obj) {
			var item = this.getMixItem(obj);
			if (DataManager.isSkill(item) || DataManager.isItem(item)) {
				return this.canUseMixAction(item);
			} else {
				return $gameParty.hasItem(item);
			}
		}, this);
	};

	Game_Battler.prototype.canPayMix = function (mix, item) {
		objects = this.getItemsObjects(mix, item);
		return objects.every(function (obj) {
			var item = obj.item;
			var value = obj.value;
			if (DataManager.isSkill(item)) {
				return this.canPayMixCost(item, value);
			} else {
				return $gameParty.numItems(item) >= value;
			}
		}, this);
	};

	Game_Battler.prototype.getItemsObjects = function (mix, item) {
		var items = [];
		var value = [];
		var mixValues = mix.clone();
		if (item) mixValues.push(this.getMixObject(item))
		mixValues.forEach(function (obj, index) {
			item = this.getMixItem(obj);
			if (value.contains(item)) {
				items[value.indexOf(item)].value++;
			} else {
				value[index] = item;
				items[index] = { item: item, value: 1 };
			}
		}, this);
		return items;
	};

	Game_Battler.prototype.getMixItem = function (obj) {
		switch (obj.type) {
			case 'i':
				return $dataItems[obj.id];
			case 'w':
				return $dataWeapons[obj.id];
			case 'a':
				return $dataArmors[obj.id];
			case 's':
				return $dataSkills[obj.id];
		}
	};

	Game_Battler.prototype.getMixObject = function (item) {
		if (DataManager.isItem(item)) return { type: 'i', id: item.id };
		if (DataManager.isSkill(item)) return { type: 's', id: item.id };
		if (DataManager.isArmor(item)) return { type: 'a', id: item.id };
		if (DataManager.isWeapon(item)) return { type: 'w', id: item.id };
		return { type: null, id: 0 };
	};

	Game_Battler.prototype.canUseMixAction = function (item) {
		if (DataManager.isSkill(item)) {
			return this.canMove() && this.canPaySkillCost(item)
		} else if (item) {
			return this.canMove() && $gameParty.hasItem(item);
		} else {
			return false;
		};
	};

	Game_Battler.prototype.canPayMixCost = function (skill, n) {
		return this._tp >= this.skillTpCost(skill) * n && this._mp >= this.skillMpCost(skill) * n;
	};

	//=============================================================================
	// Game_Actor
	//=============================================================================

	Game_Actor.prototype.mixActions = function () {
		var mixList = this.mixActionsObjects();
		var result = {};
		for (var i = 0; i < mixList.length; i++) {
			var mix = mixList[i];
			result[mix.name] = mix;
		}
		return result;
	};

	Game_Actor.prototype.mixActionsObjects = function () {
		return this.traitObjects().reduce(function (r, data) {
			return r.concat(data.mixActions);
		}, []);
	};

	//=============================================================================
	// Window_ActorCommand
	//=============================================================================

	Game_Party.prototype.consumeEquip = function (item) {
		if (DataManager.isWeapon(item) && item.mixConsumable) {
			this.loseItem(item, 1);
		} else if (DataManager.isArmor(item) && item.mixConsumable) {
			this.loseItem(item, 1);
		}
	};

	//=============================================================================
	// Window_ActorCommand
	//=============================================================================

	VictorEngine.MixActions.addSkillCommands = Window_ActorCommand.prototype.addSkillCommands;
	Window_ActorCommand.prototype.addSkillCommands = function () {
		VictorEngine.MixActions.addSkillCommands.call(this);
		var mixList = this._actor.mixActions();
		Object.keys(mixList).forEach(function (key) {
			var mix = mixList[key]
			if (!mix.hidden) { this.addCommand(mix.name, 'mix action', true, mix.name) }
		}, this);
	};

	//=============================================================================
	// Scene_Battle
	//=============================================================================

	VictorEngine.MixActions.createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
	Scene_Battle.prototype.createActorCommandWindow = function () {
		VictorEngine.MixActions.createActorCommandWindow.call(this);
		this._actorCommandWindow.setHandler('mix action', this.commandMixAction.bind(this));
	};

	VictorEngine.MixActions.createSkillWindow = Scene_Battle.prototype.createSkillWindow;
	Scene_Battle.prototype.createSkillWindow = function () {
		VictorEngine.MixActions.createSkillWindow.call(this);
		this.createMixWindow();
	};

	VictorEngine.MixActions.isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
	Scene_Battle.prototype.isAnyInputWindowActive = function () {
		return (VictorEngine.MixActions.isAnyInputWindowActive.call(this) ||
			this._mixWindow.active);
	};

	VictorEngine.MixActions.onActorCancel = Scene_Battle.prototype.onActorCancel;
	Scene_Battle.prototype.onActorCancel = function () {
		VictorEngine.MixActions.onActorCancel.call(this)
		switch (this._actorCommandWindow.currentSymbol()) {
			case 'mix action':
				this._mixWindow.show();
				this._mixWindow.activate();
				break;
		}
	};

	VictorEngine.MixActions.onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
	Scene_Battle.prototype.onEnemyCancel = function () {
		VictorEngine.MixActions.onEnemyCancel.call(this)
		switch (this._actorCommandWindow.currentSymbol()) {
			case 'mix action':
				this._mixWindow.show();
				this._mixWindow.activate();
				break;
		}
	};
	Scene_Battle.prototype.createMixWindow = function () {
		var wy = this._helpWindow.y + this._helpWindow.height;
		var wh = this._statusWindow.y - wy;
		this._mixWindow = new Window_BattleMix(0, wy, Graphics.boxWidth, wh);
		this._mixWindow.setHelpWindow(this._helpWindow);
		this._mixWindow.setHandler('ok', this.onMixOk.bind(this));
		this._mixWindow.setHandler('cancel', this.onMixCancel.bind(this));
		this.addWindow(this._mixWindow);
	};

	Scene_Battle.prototype.commandMixAction = function () {
		this._mixIndex = 0
		this._mixWindow.clear();
		this._mixWindow.setActor(BattleManager.actor());
		this.setupMixAction();
	};

	Scene_Battle.prototype.setupMixAction = function () {
		var mixList = BattleManager.actor().mixActions()
		this._mixWindow.setMixType(mixList[this._actorCommandWindow.currentExt()]);
		this._mixWindow.setMixIndex(this._mixIndex)
		this._mixWindow.refresh();
		this._mixWindow.show();
		this._mixWindow.activate();
	};

	Scene_Battle.prototype.onMixOk = function () {
		if (this._mixIndex === this._mixWindow.maxMix() - 1) {
			this._mixWindow.setMix();
			var skill = this._mixWindow.setAction();
			var action = BattleManager.inputtingAction();
			action.setSkill(skill);
			action.setMix(this._mixWindow.getMix())
			this._mixWindow.hide();
			this.onSelectAction();
		} else {
			this._mixIndex++;
			this._mixWindow.setMix();
			this.setupMixAction();
			this._mixWindow.close();
			this._mixWindow.open();
		}
	};

	Scene_Battle.prototype.onMixCancel = function () {
		if (this._mixIndex === 0) {
			this._mixWindow.hide();
			this._actorCommandWindow.activate();
		} else {
			this._mixIndex--;
			this._mixWindow.removeMix();
			this.setupMixAction();

		}
	};

})();

//=============================================================================
// Window_BattleMix
//=============================================================================	

function Window_BattleMix() {
	this.initialize.apply(this, arguments);
}

Window_BattleMix.prototype = Object.create(Window_Selectable.prototype);
Window_BattleMix.prototype.constructor = Window_BattleMix;

(function () {

	Window_BattleMix.prototype.initialize = function (x, y, width, height) {
		Window_Selectable.prototype.initialize.call(this, x, y, width, height);
		this._actor = null;
		this.clear();
		this.hide();
	};

	Window_BattleMix.prototype.clear = function () {
		this._mixIndex = 0
		this._data = [];
		this._mix = [];
		this._mixType = {};
	};

	Window_BattleMix.prototype.setActor = function (actor) {
		if (this._actor !== actor) {
			this._actor = actor;
			this.refresh();
			this.resetScroll();
		}
	};

	Window_BattleMix.prototype.setMixType = function (mixType) {
		if (this._mixType !== mixType) {
			this._mixType = mixType;
			this.refresh();
			this.resetScroll();
		}
	};

	Window_BattleMix.prototype.setMixIndex = function (mixIndex) {
		if (this._mixIndex !== mixIndex) {
			this._mixIndex = mixIndex;
			this.refresh();
			this.resetScroll();
		}
	};

	Window_BattleMix.prototype.mixSelection = function (mixIndex) {
		if (this._mixType.selection && this._mixType.selection[this._mixIndex]) {
			return this._mixType.selection[this._mixIndex].values;
		} else {
			return []
		}
	};

	Window_BattleMix.prototype.maxMix = function () {
		return this._mixType.selection ? this._mixType.selection.length : 1;
	};

	Window_BattleMix.prototype.setMix = function () {
		this._mix.push(this._actor.getMixObject(this.item()));
		this._mix.sort(function (a, b) {
			if (a.type === b.type) {
				return a.id - b.id;
			} else {
				var p1 = (a.type === 'i') ? 1 : (a.type === 's') ? 2 : (a.type === 'w') ? 3 : 4;
				var p2 = (b.type === 'i') ? 1 : (b.type === 's') ? 2 : (b.type === 'w') ? 3 : 4;
				return p1 - p2;
			}
		});
	};

	Window_BattleMix.prototype.removeMix = function () {
		this._mix.pop();
	};

	Window_BattleMix.prototype.getMix = function () {
		return this._mix;
	};

	Window_BattleMix.prototype.setAction = function () {
		result = this._mixType.results.filter(function (result) {
			return this.checkMixResult(result.values);
		}, this);
		var failure = this._mixType.failure || VictorEngine.Parameters.MixActions.DefaultFailure;
		return result[0] ? result[0].id : failure;
	};

	Window_BattleMix.prototype.checkMixResult = function (result) {
		return result.every(function (obj, index) {
			var obj2 = this._mix[index];
			return (obj2 && obj.id === obj2.id && obj.type === obj2.type)
		}, this);
	};

	Window_BattleMix.prototype.maxCols = function () {
		return 2;
	};

	Window_BattleMix.prototype.spacing = function () {
		return 48;
	};

	Window_BattleMix.prototype.maxItems = function () {
		return this._data ? this._data.length : 1;
	};

	Window_BattleMix.prototype.item = function () {
		return this._data && this.index() >= 0 ? this._data[this.index()] : null;
	};

	Window_BattleMix.prototype.isCurrentItemEnabled = function () {
		return this.isEnabled(this._data[this.index()]);
	};

	Window_BattleMix.prototype.includes = function (item) {
		return item && item.stypeId === this._stypeId;
	};

	Window_BattleMix.prototype.isEnabled = function (item) {
		return this._actor && this._actor.isValidMix(this._mix, item);
	};

	Window_BattleMix.prototype.makeItemList = function () {
		if (this._actor) {
			this._data = this.getItemList();
		} else {
			this._data = [];
		}
	};

	Window_BattleMix.prototype.getItemList = function () {
		var getItems = this.getItems.bind(this);
		return this.mixSelection().reduce(function (r, obj) {
			return r.concat(getItems(obj));
		}, []);
	};

	Window_BattleMix.prototype.getItems = function (obj) {
		switch (obj.type) {
			case 'i':
				return $gameParty.items().filter(function (item) {
					return item && item.id === obj.id;
				}, this);
			case 's':
				return this._actor.skills().filter(function (item) {
					return item && item.id === obj.id;
				}, this);
			case 'a':
				return $gameParty.armors().filter(function (item) {
					return item && item.id === obj.id;
				}, this);
			case 'w':
				return $gameParty.weapons().filter(function (item) {
					return item && item.id === obj.id;
				}, this);
			case 'it':
				return $gameParty.items().filter(function (item) {
					return item && item.itypeId === obj.id;
				}, this);
			case 'st':
				return this._actor.skills().filter(function (item) {
					return item && item.stypeId === obj.id;
				}, this);
			case 'at':
				return $gameParty.armors().filter(function (item) {
					return item && item.atypeId === obj.id;
				}, this);
			case 'wt':
				return $gameParty.weapons().filter(function (item) {
					return item && item.wtypeId === obj.id;
				}, this);
		};
	};

	Window_BattleMix.prototype.selectLast = function () {
		this.select(0);
	};

	Window_BattleMix.prototype.drawItem = function (index) {
		var item = this._data[index];
		if (DataManager.isSkill(item)) {
			this.drawSkillData(item, index);
		} else if (item) {
			this.drawItemData(item, index);
		}
	};

	Window_BattleMix.prototype.drawSkillData = function (item, index) {
		var numberWidth = this.numberWidth();
		var rect = this.itemRect(index);
		rect.width -= this.textPadding();
		this.changePaintOpacity(this.isEnabled(item));
		this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
		this.drawSkillCost(item, rect.x, rect.y, rect.width);
		this.changePaintOpacity(1);
	};

	Window_BattleMix.prototype.drawItemData = function (item, index) {
		var numberWidth = this.numberWidth();
		var rect = this.itemRect(index);
		rect.width -= this.textPadding();
		this.changePaintOpacity(this.isEnabled(item));
		this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
		this.drawItemNumber(item, rect.x, rect.y, rect.width);
		this.changePaintOpacity(1);
	};

	Window_BattleMix.prototype.numberWidth = function () {
		return this.textWidth('000');
	};

	Window_BattleMix.prototype.drawItemNumber = function (item, x, y, width) {
		this.drawText(':', x, y, width - this.textWidth('00'), 'right');
		this.drawText($gameParty.numItems(item), x, y, width, 'right');
	};

	Window_BattleMix.prototype.drawSkillCost = function (skill, x, y, width) {
		if (this._actor.skillTpCost(skill) > 0) {
			this.changeTextColor(this.tpCostColor());
			this.drawText(this._actor.skillTpCost(skill), x, y, width, 'right');
		} else if (this._actor.skillMpCost(skill) > 0) {
			this.changeTextColor(this.mpCostColor());
			this.drawText(this._actor.skillMpCost(skill), x, y, width, 'right');
		}
	};

	Window_BattleMix.prototype.updateHelp = function () {
		this.setHelpWindowItem(this.item());
	};

	Window_BattleMix.prototype.refresh = function () {
		this.makeItemList();
		this.createContents();
		this.drawAllItems();
	};

	Window_BattleMix.prototype.show = function () {
		this.selectLast();
		this.showHelpWindow();
		Window_Selectable.prototype.show.call(this);
	};

	Window_BattleMix.prototype.hide = function () {
		this.hideHelpWindow();
		Window_Selectable.prototype.hide.call(this);
	};

})(); 