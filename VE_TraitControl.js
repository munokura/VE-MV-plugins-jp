/*
 * ==============================================================================
 * ** Victor Engine MV - Trait Control
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.12.31 > First release.
 *  v 1.01 - 2016.01.07 > Fixed issue with AttackTimes and AttackSpeed traits.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Trait Control'] = '1.01';

var VictorEngine = VictorEngine || {};
VictorEngine.TraitControl = VictorEngine.TraitControl || {};

(function () {

	VictorEngine.TraitControl.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.TraitControl.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Trait Control', 'VE - Basic Module', '1.07');
	};

	VictorEngine.TraitControl.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.TraitControl.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.01 - Adds new escape codes to be used on texts.
 * @author Victor Sant
 *
 * @help 
 * ------------------------------------------------------------------------------ 
 *  Plugin Commands
 * ------------------------------------------------------------------------------
 *
 *  You can use v[id] on the instead of a numeric value to get the value from 
 *  the variable with the id set. For example, v[3] will get the value from the
 *  variable id 3.
 *
 * ---------------
 *
 *  AddTrait actor id type data value
 *	  Adds a trait to an actor.
 *      id    : actor Id.
 *      type  : trait type.  (see bellow)
 *      data  : trait data.  (see bellow)
 *      value : trait value. (see bellow)
 *
 * ---------------
 *
 *  RemoveTrait actor id type data value
 *	  Removes a trait from an actor.
 *      id    : actor Id.
 *      type  : trait type.  (see bellow)
 *      data  : trait data.  (see bellow)
 *      value : trait value. (see bellow)
 *
 * ---------------
 *
 *  AddTrait party index type data value
 *	  Adds a trait to a party member.
 *      index : party member index.
 *      type  : trait type.  (see bellow)
 *      data  : trait data.  (see bellow)
 *      value : trait value. (see bellow)
 *
 * ---------------
 *
 *  RemoveTrait party index type data value
 *	  Removes a trait from a party member.
 *      index : party member index.
 *      type  : trait type.  (see bellow)
 *      data  : trait data.  (see bellow)
 *      value : trait value. (see bellow)
 *
 * ---------------
 *
 *  AddTrait enemy index type data value
 *	  Adds a trait to an actor.
 *      index : enemy troop index.
 *      type  : trait type.  (see bellow)
 *      data  : trait data.  (see bellow)
 *      value : trait value. (see bellow)
 *
 * ---------------
 *
 *  RemoveTrait enemy index type data value
 *	  Removes a trait from an actor.
 *      index : enemy troop index.
 *      type  : trait type.  (see bellow)
 *      data  : trait data.  (see bellow)
 *      value : trait value. (see bellow)
 *
 * ---------------
 *
 *  ClearTrait actor id
 *	  Clear the changes of trait from an actor.
 *      id  : actor Id.
 *
 * ---------------
 *
 *  ClearTrait party index
 *	  Clear the changes of trait from an actor.
 *      index : party member index.
 *
 * ---------------
 *
 *  ClearTrait enemy id
 *	  Clear the changes of trait from an actor.
 *      index : enemy troop index.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  - Trait info:
 *  The type, data and values vary from trait to trait.
 *    type  : the trait name.
 *    data  : numeric value that set the trait object.
 *    value : numeric value that set the trait effect. Not used for some traits.
 *
 * ---------------
 *
 *    type  : ElementRate
 *    data  : element ID (database value)
 *    value : efficiency rate (0-1000)
 *
 * ---------------
 *
 *    type  : DebuffRate
 *    data  : 0: hp, 1: mp, 2: atk, 3: def, 4: mdf, 5: mat, 6: agi, 7: luk
 *    value : efficiency rate (0-1000)
 *
 * ---------------
 *
 *    type  : StateRate
 *    data  : state ID (database value)
 *    value : efficiency rate (0-1000)
 *
 * ---------------
 *
 *    type  : StateResist
 *    data  : state ID (database value)
 *    value : none
 *
 * ---------------
 *
 *    type  : Parameter
 *    data  : 0: hp, 1: mp, 2: atk, 3: def, 4: mdf, 5: mat, 6: agi, 7: luk
 *    value : efficiency rate (0-1000)
 *
 * ---------------
 *
 *    type  : Ex-Parameter
 *    data  : 0: hit, 1: evasion, 2: critical, 3: critical eva, 4: magic eva,
 *            5: reflection, 6: counter, 7: HP regen, 8: MP regen, 9: TP regen
 *    value : efficiency rate (0-1000)
 *
 * ---------------
 *
 *    type  : Sp-Parameter
 *    data  : 0: aggro, 1: defense, 2: recovery, 3: pharmacology, 4: MP cost,
 *            5: TP charge, 6: physical damage, 7: magic damage,
 *            8: terrain damage, 9: Experience aquisition
 *    value : efficiency rate (0-1000)
 *
 * ---------------
 *
 *    type  : AttackElement
 *    data  : element ID (database value)
 *    value : none
 *
 * ---------------
 *
 *    type  : AttackState
 *    data  : state ID (database value)
 *    value : efficiency rate (0-1000)
 *
 * ---------------
 *
 *    type  : AttackSpeed
 *    data  : correction (0-999, can be negative)
 *    value : none
 *
 * ---------------
 *
 *    type  : AttackTimes
 *    data  : number of extra attack (0-9)
 *    value : none
 *
 * ---------------
 *
 *    type  : AddSkillType
 *    data  : skill type ID (database value)
 *    value : none
 *
 * ---------------
 *
 *    type  : SealSkillType
 *    data  : skill type ID (database value)
 *    value : none
 *
 * ---------------
 *
 *    type  : AddSkill
 *    data  : skill ID (database value)
 *    value : none
 *
 * ---------------
 *
 *    type  : SealSkill
 *    data  : skill ID (database value)
 *    value : none
 *
 * ---------------
 *
 *    type  : EquipWeapon
 *    data  : weapon type ID (database value)
 *    value : none
 *
 * ---------------
 *
 *    type  : EquipArmor
 *    data  : armor type ID (database value)
 *    value : none
 *
 * ---------------
 *
 *    type  : LockEquip
 *    data  : 0: weapon, 1: shield, 2: helmet, 3: armor, 4: accessory
 *    value : none
 *
 * ---------------
 *
 *    type  : SealEquip
 *    data  : 0: weapon, 1: shield, 2: helmet, 3: armor, 4: accessory
 *    value : none
 *
 * ---------------
 *
 *    type  : SlotType
 *    data  : 0: two swords
 *    value : none
 *
 * ---------------
 *
 *    type  : ActionTimes
 *    data  : rate (0-1000)
 *    value : none
 *
 * ---------------
 *
 *    type  : SpecialFlag
 *    data  : 0: auto combat, 1: guard, 2: substitute, 3: TP carried over
 *    value : none
 *
 * ---------------
 * 
 *    type  : CollapseEffect
 *    data  : 0: boss, 1: instant disappear, 3: Doesn't disappear
 *    value : none
 *
 * ---------------
 *
 *    type  : PartyAbility
 *    data  : 0: encounter halved, 1: encounter disabled, 2: surprise disabled,
 *            3: preemptive bonus, 4: money get x2, 5: experience get x2
 *    value : none
 *
 * ---------------
 *
 *  - Removing a trait:
 *  Removing a trait removes only the traits that are *exactly* the same.
 *  So, if you have the trait "ElementRate 2 75", you must remove the trait
 *  "ElementRate 2 75". If you try to remove, for example, the trait
 *  "ElementRate 2 50", it will have no effect on the trait "ElementRate 2 75".
 *  Notabily, the trait will not become "ElementRate 2 25". Generally, the 
 *  remove trait is better used with traits that don't have values.
 *
 *  When you add a trait that is removed, it will cancel the trait removal.
 *  This happens only when adding traits with the plugin command, traits
 *  added other ways (let's say, equiping an armor) will not cancel the remove.
 *
 *  Removing a trait don't actually removes it, it just make so the trait have
 *  no effect. If you cancel the remove trait, the existing traits will have
 *  effect again.
 * 
 * ------------------------------------------------------------------------------
 * Example Plugin Commands:
 * ------------------------------------------------------------------------------
 *
 *  AddTrait actor 1 AttackElement 3
 *
 * ---------------
 *
 *  AddTrait enemy 2 ElementRate 2 150
 *
 * ---------------
 *
 *  RemoveTrait actor 3 PartyAbility 3
 * 
 */
/*:ja
 * @plugindesc v1.01 ゲーム中に特徴を追加・削除できます。
 * @author Victor Sant
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/trait-control/
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
 *  プラグインコマンド
 * ---------------------------------------------------------------------------
 *
 * 数値の代わりにv[id]を使用して、
 * idが設定された変数から値を取得することができます。
 * 例えば、v[3]は変数ID3から値を取得します。
 *
 *
 * ---------------
 *
 *  AddTrait actor id type data value
 *      アクターに特徴を追加します。
 *      id    : アクターID
 *      type  : 特徴タイプ  (後述)
 *      data  : 特徴データ  (後述)
 *      value : 特徴値 (後述)
 *
 * ---------------
 *
 *  RemoveTrait actor id type data value
 *      アクターから特徴を削除します。
 *      id    : アクターID
 *      type  : 特徴タイプ  (後述)
 *      data  : 特徴データ  (後述)
 *      value : 特徴値 (後述)
 *
 * ---------------
 *
 *  AddTrait party index type data value
 *      パーティメンバーに特徴を追加します。
 *      index : パーティメンバー位置
 *      type  : 特徴タイプ  (後述)
 *      data  : 特徴データ  (後述)
 *      value : 特徴値 (後述)
 *
 * ---------------
 *
 *  RemoveTrait party index type data value
 *      パーティメンバーから特徴を削除します。
 *      index : パーティメンバー位置
 *      type  : 特徴タイプ  (後述)
 *      data  : 特徴データ  (後述)
 *      value : 特徴値 (後述)
 *
 * ---------------
 *
 *  AddTrait enemy index type data value
 *      敵キャラに特徴を追加します。
 *      index : 敵キャラID
 *      type  : 特徴タイプ  (後述)
 *      data  : 特徴データ  (後述)
 *      value : 特徴値 (後述)
 *
 * ---------------
 *
 *  RemoveTrait enemy index type data value
 *      敵キャラから特徴を削除します。
 *      index : 敵キャラID
 *      type  : 特徴タイプ  (後述)
 *      data  : 特徴データ  (後述)
 *      value : 特徴値 (後述)
 *
 * ---------------
 *
 *  ClearTrait actor id
 *      アクターに加えられた特徴の変化をリセットします。
 *      id  : アクターID
 *
 * ---------------
 *
 *  ClearTrait party index
 *      パーティメンバーに加えられた特徴の変化をリセットします。
 *      index : パーティメンバー位置
 *
 * ---------------
 *
 *  ClearTrait enemy id
 *      敵キャラに加えられた特徴の変化をリセットします。
 *      index : 敵キャラID
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 *  - 特徴について
 *  特徴毎に type, data  value の記述方法は異なります。
 *    type  : 特徴名を指定
 *    data  : 特徴オブジェクトを設定する数値
 *    value : 特徴効果を設定する数値。一部の特徴には使用されません。
 *
 * ---------------
 *
 *    type  : ElementRate (属性有効度)
 *    data  : 属性ID (データベース値)
 *    value : 倍率 (0-1000)
 *
 * ---------------
 *
 *    type  : DebuffRate (弱体有効度)
 *    data  : 0: 最大HP, 1: 最大MP, 2: 攻撃力, 3: 防御力, 4: 魔法力,
 *            5: 魔法防御, 6: 俊敏性, 7: 運
 *    value : 倍率 (0-1000)
 *
 * ---------------
 *
 *    type  : StateRate (ステート有効度)
 *    data  : ステートID (データベース値)
 *    value : 倍率 (0-1000)
 *
 * ---------------
 *
 *    type  : StateResist (ステート無効化)
 *    data  : ステートID (データベース値)
 *    value : なし
 *
 * ---------------
 *
 *    type  : Parameter (通常能力値)
 *    data  : 0: 最大HP, 1: 最大MP, 2: 攻撃力, 3: 防御力, 4: 魔法力,
 *            5: 魔法防御, 6: 俊敏性, 7: 運
 *    value : 倍率 (0-1000)
 *
 * ---------------
 *
 *    type  : Ex-Parameter (追加能力値)
 *    data  : 0: 命中率, 1: 回避率, 2: 会心率, 3: 会心回避率, 4: 魔法回避率,
 *            5: 魔法反射率, 6: 反撃率, 7: HP再生率, 8: MP再生率, 9: TP再生率
 *    value : 倍率 (0-1000)
 *
 * ---------------
 *
 *    type  : Sp-Parameter (特殊能力値)
 *    data  : 0: 狙われ率, 1: 防御硬化率, 2: 回復効果率, 3: 薬の知識,
 *            4: MP消費率, 5: TPチャージ率, 6: 物理ダメージ率,
 *            7: 魔法ダメージ率, 8: 床ダメージ率, 9: 経験獲得率
 *    value : 倍率 (0-1000)
 *
 * ---------------
 *
 *    type  : AttackElement (攻撃時属性)
 *    data  : 属性ID (データベース値)
 *    value : なし
 *
 * ---------------
 *
 *    type  : AttackState (攻撃時ステート)
 *    data  : ステートID (データベース値)
 *    value : 倍率 (0-1000)
 *
 * ---------------
 *
 *    type  : AttackSpeed (攻撃速度補正)
 *    data  : 補正値 (0-999, 負の値も可能)
 *    value : なし
 *
 * ---------------
 *
 *    type  : AttackTimes (攻撃追加回数)
 *    data  : 攻撃追加回数 (0-9)
 *    value : なし
 *
 * ---------------
 *
 *    type  : AddSkillType (スキルタイプ追加)
 *    data  : スキルタイプID (データベース値)
 *    value : なし
 *
 * ---------------
 *
 *    type  : SealSkillType (スキルタイプ封印)
 *    data  : スキルタイプID (データベース値)
 *    value : なし
 *
 * ---------------
 *
 *    type  : AddSkill (スキル追加)
 *    data  : スキルID (データベース値)
 *    value : なし
 *
 * ---------------
 *
 *    type  : SealSkill (スキル封印)
 *    data  : スキルID (データベース値)
 *    value : なし
 *
 * ---------------
 *
 *    type  : EquipWeapon (武器タイプ装備)
 *    data  : 武器タイプID (データベース値)
 *    value : なし
 *
 * ---------------
 *
 *    type  : EquipArmor (防具タイプ装備)
 *    data  : 防具タイプID (データベース値)
 *    value : なし
 *
 * ---------------
 *
 *    type  : LockEquip (装備固定)
 *    data  : 0: 武器, 1: 盾, 2: 頭, 3: 身体, 4: 装飾品
 *    value : なし
 *
 * ---------------
 *
 *    type  : SealEquip (装備封印)
 *    data  : 0: 武器, 1: 盾, 2: 頭, 3: 身体, 4: 装飾品
 *    value : なし
 *
 * ---------------
 *
 *    type  : SlotType (スロットタイプ)
 *    data  : 0: 二刀流
 *    value : なし
 *
 * ---------------
 *
 *    type  : ActionTimes (行動回数追加)
 *    data  : 率 (0-1000)
 *    value : なし
 *
 * ---------------
 *
 *    type  : SpecialFlag (特殊フラグ)
 *    data  : 0: 自動戦闘, 1: 防御, 2: 身代わり, 3: TP持ち越し
 *    value : なし
 *
 * ---------------
 *
 *    type  : CollapseEffect (消滅エフェクト)
 *    data  : 0: ボス, 1: 瞬間消去, 3: 消えない
 *    value : なし
 *
 * ---------------
 *
 *    type  : PartyAbility (パーティ能力)
 *    data  : 0: エンカウント半減, 1: エンカウント無効, 2: 不意打ち無効,
 *            3: 先制攻撃率アップ, 4: 獲得金額2倍, 5: アイテム入手率2倍
 *    value : なし
 *
 * ---------------
 *
 *  - Removing a trait:
 * 特徴を削除すると、厳密に同じ特徴だけが削除されます。
 * つまり、'ElementRate 2 75'という特徴がある場合、
 * 'ElementRate 2 75'という特徴を削除しなければなりません。
 * 例えば、'ElementRate 2 50'という特徴を削除しようとしても、
 * 'ElementRate 2 75'という特徴には何の影響もありません。
 * また、特徴が'ElementRate 2 25'になることもありません。
 * 一般的に、特徴削除は値を持たない特徴に対して使用するのが良いでしょう。
 *
 * 削除された特徴を追加すると、削除された特徴はキャンセルされます。
 * プラグインコマンドで特徴を追加した場合のみ発生し、
 * 他の方法で追加した特徴(例えば、防具を装備するなど)では
 * 削除はキャンセルされません。
 *
 * 特徴を削除しても実際には削除されず、特徴の効果がないようにするだけです。
 * 削除された特徴をキャンセルすると、既存の特徴は再び効果を持ちます。
 *
 * ---------------------------------------------------------------------------
 * プラグインコマンドの例
 * ---------------------------------------------------------------------------
 *
 *  AddTrait actor 1 AttackElement 3
 *
 * ---------------
 *
 *  AddTrait enemy 2 ElementRate 2 150
 *
 * ---------------
 *
 *  RemoveTrait actor 3 PartyAbility 3
 *
 */

(function () {

	//=============================================================================
	// Window_Base
	//=============================================================================

	VictorEngine.TraitControl.initMembers = Game_BattlerBase.prototype.initMembers;
	Game_BattlerBase.prototype.initMembers = function () {
		VictorEngine.TraitControl.initMembers.call(this);
		this.clearTraits();
	};

	VictorEngine.TraitControl.allTraits = Game_BattlerBase.prototype.allTraits;
	Game_BattlerBase.prototype.allTraits = function () {
		var traits = VictorEngine.TraitControl.allTraits.call(this).concat(this._addedTraits)
		return traits.filter(function (obj) { return !this.sameTrait(this._removedTraits, obj) }, this);
	};

	Game_BattlerBase.prototype.clearTraits = function () {
		this._addedTraits = [];
		this._removedTraits = [];
	};

	Game_BattlerBase.prototype.addTrait = function (type, id, value) {
		var code = this.getTraitCode(type);
		var trait = this.setupTraitCode(code, id, value)
		if (code && !this.sameTrait(this.allTraits(), trait)) {
			if (this.sameTrait(this._removedTraits, trait)) {
				var index = this._removedTraits.indexOf(trait);
				if (index > -1) this._removedTraits.splice(index, 1);
			} else {
				this._addedTraits.push(trait);
			}
		}
	};

	Game_BattlerBase.prototype.setupTraitCode = function (code, id, value) {
		switch (code) {
			case Game_BattlerBase.TRAIT_ATTACK_SPEED: case Game_BattlerBase.TRAIT_ATTACK_TIMES:
				return { code: code, dataId: 0, value: id }
			default:
				return { code: code, dataId: id, value: value }
		}
	};

	Game_BattlerBase.prototype.removeTrait = function (type, id, value) {
		var code = this.getTraitCode(type);
		var trait = { code: code, dataId: id, value: value }
		if (code && !this.sameTrait(this._removedTraits, trait)) this._removedTraits.push(trait);
	};

	Game_BattlerBase.prototype.sameTrait = function (traits, obj) {
		return traits.some(function (trait) {
			return (obj.code === trait.code && obj.dataId === trait.dataId && obj.value === trait.value);
		});
	};

	Game_BattlerBase.prototype.getTraitCode = function (type) {
		switch (type.toUpperCase()) {
			case "ELEMENTRATE":
				return Game_BattlerBase.TRAIT_ELEMENT_RATE;
				break;
			case "DEBUFFRATE":
				return Game_BattlerBase.TRAIT_DEBUFF_RATE;
				break;
			case "STATERATE":
				return Game_BattlerBase.TRAIT_STATE_RATE;
				break;
			case "STATERESIST":
				return Game_BattlerBase.TRAIT_STATE_RESIST;
				break;
			case "PARAMETER":
				return Game_BattlerBase.TRAIT_PARAM;
				break;
			case "EX-PARAMETER":
				return Game_BattlerBase.TRAIT_XPARAM;
				break;
			case "SP-PARAMETER":
				return Game_BattlerBase.TRAIT_SPARAM;
				break;
			case "ATTACKELEMENT":
				return Game_BattlerBase.TRAIT_ATTACK_ELEMENT;
				break;
			case "ATTACKSTATE":
				return Game_BattlerBase.TRAIT_ATTACK_STATE;
				break;
			case "ATTACKSPEED":
				return Game_BattlerBase.TRAIT_ATTACK_SPEED;
				break;
			case "ATTACKTIMES":
				return Game_BattlerBase.TRAIT_ATTACK_TIMES;
				break;
			case "ADDSKILLTYPE":
				return Game_BattlerBase.TRAIT_STYPE_ADD;
				break;
			case "SEALSKILLTYPE":
				return Game_BattlerBase.TRAIT_STYPE_SEAL;
				break;
			case "ADDSKILL":
				return Game_BattlerBase.TRAIT_SKILL_ADD;
				break;
			case "SEALSKILL":
				return Game_BattlerBase.TRAIT_SKILL_SEAL;
				break;
			case "EQUIPWEAPON":
				return Game_BattlerBase.TRAIT_EQUIP_WTYPE;
				break;
			case "EQUIPARMOR":
				return Game_BattlerBase.TRAIT_EQUIP_ATYPE;
				break;
			case "LOCKEQUIP":
				return Game_BattlerBase.TRAIT_EQUIP_LOCK;
				break;
			case "SEALEQUIP":
				return Game_BattlerBase.TRAIT_EQUIP_SEAL;
				break;
			case "SLOTTYPE":
				return Game_BattlerBase.TRAIT_SLOT_TYPE;
				break;
			case "ACTIONTIMES":
				return Game_BattlerBase.TRAIT_ACTION_PLUS;
				break;
			case "SPECIALFLAG":
				return Game_BattlerBase.TRAIT_SPECIAL_FLAG;
				break;
			case "COLLAPSEEFFECT":
				return Game_BattlerBase.TRAIT_COLLAPSE_TYPE;
				break;
			case "PARTYABILITY":
				return Game_BattlerBase.TRAIT_PARTY_ABILITY;
				break;
			default:
				return null;
				break;
		};
	};

	//=============================================================================
	// Game_Interpreter
	//=============================================================================

	VictorEngine.TraitControl.pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		VictorEngine.TraitControl.pluginCommand.call(this, command, args);
		var v = $gameVariables._data;
		if (command.toLowerCase() === 'addtrait') {
			var type = String(args[2]);
			var dataId = Number(eval(args[3]));
			var value = Number(eval(args[4])) || 1;
			if (args[0].toLowerCase() === 'actor') {
				var actor = $gameActors.actor(Number(eval(args[1])));
				if (actor) actor.addTrait(type, dataId, value);
			}
			if (args[0].toLowerCase() === 'party') {
				var actor = $gameParty.members(Number(eval(args[1])));
				if (actor) actor.addTrait(type, dataId, value);
			}
			if (args[0].toLowerCase() === 'enemy') {
				var enemy = $gameTroop.members(Number(eval(args[1])));
				if (enemy) enemy.addTrait(type, dataId, value);
			}
		}
		if (command.toLowerCase() === 'removetrait') {
			var type = String(args[2]);
			var dataId = Number(eval(args[3]));
			var value = Number(eval(args[4])) || 1;
			if (args[0].toLowerCase() === 'actor') {
				var actor = $gameActors.actor(Number(eval(args[1])));
				if (actor) actor.removeTrait(type, dataId, value);
			}
			if (args[0].toLowerCase() === 'party') {
				var actor = $gameParty.members(Number(eval(args[1])));
				if (actor) actor.removeTrait(type, dataId, value);
			}
			if (args[0].toLowerCase() === 'enemy') {
				var enemy = $gameTroop.members(Number(eval(args[1])));
				if (enemy) enemy.removeTrait(type, dataId, value);
			}
		}
		if (command.toLowerCase() === 'cleartrait') {
			if (args[0].toLowerCase() === 'actor') {
				var actor = $gameActors.actor(Number(eval(args[1])));
				if (actor) actor.clearTraits();
			}
			if (args[0].toLowerCase() === 'party') {
				var actor = $gameParty.members(Number(eval(args[1])));
				if (actor) actor.clearTraits();
			}
			if (args[0].toLowerCase() === 'enemy') {
				var enemy = $gameTroop.members(Number(eval(args[1])));
				if (enemy) enemy.clearTraits();
			}
		}
	};

})(); 