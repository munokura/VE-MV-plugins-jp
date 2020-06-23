/*
 * ===========================================================================
 * ** Victor Engine MV - Critical Hit Effects
 * ---------------------------------------------------------------------------
 *  VE_CriticalHitEffects.js
 * ===========================================================================
 */

var Imported = Imported || {};
Imported['VE - Critical Hit Effects'] = '1.02';

var VictorEngine = VictorEngine || {};
VictorEngine.CriticalHitEffects = VictorEngine.CriticalHitEffects || {};

(function() {

	VictorEngine.CriticalHitEffects.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.CriticalHitEffects.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Critical Hit Effects', 'VE - Basic Module', '1.09');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Critical Hit Effects', 'VE - Hit Formula');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Critical Hit Effects', 'VE - Action Dodge');
	};

	VictorEngine.CriticalHitEffects.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.CriticalHitEffects.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.02 - Improved control over critial hits and critical damage.
 * @author Victor Sant
 *
 * @param Base Critical Damage
 * @desc Additional damage rate for critical damage.
 * Default: 100
 * @default 100
 *
 * @param Early Critical Check
 * @desc Check for critical is done before the action is executed.
 * true - ON	false - OFF
 * @default false
 *
 * @param Never Miss Critical
 * @desc If 'Early Critical Check' is ON, critical attacks never miss.
 * true - ON	false - OFF
 * @default false
 *
 * @help
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Damage (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <critical damage: x>
 *  <critical damage: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Change all critial damage dealt by the battler.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical damage: +50%>
 *       <critical damage: -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Damage (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <critical damage: x, y>
 *  <critical damage: x, y%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Change the critial damage dealt by the battler when using a specific skill.
 *     x : skill Id.
 *     y : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical damage: 10, +50%>
 *       <critical damage: 15, -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Damage (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <custom critical damage>
 *   result = code
 *  </custom critical damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial damage dealt by the battler.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical damage>
 *         result = a.atk * 4
 *        </custom critical damage>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Damage (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <custom critical damage: x>
 *   result = code
 *  </custom critical damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial damage dealt by the battler when
 *   using a skill.
 *     x    : skill Id.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical damage: 15>
 *         result = a.atk * 4
 *        </custom critical damage>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Rate (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <critical rate: x>
 *  <critical rate: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Change the critial rate of the battler.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical rate: +50%>
 *       <critical rate: -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Rate (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <critical rate: x, y>
 *  <critical rate: x, y%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Change the critial rate of the battler when using a specific skill.
 *     x : skill Id.
 *     y : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical rate: 10, +50%>
 *       <critical rate: 15, -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Rate (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <custom critical rate>
 *   result = code
 *  </custom critical rate>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial rate of the battler.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical rate>
 *         result = a.agi / 10
 *        </custom critical rate>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Rate (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <custom critical rate: x>
 *   result = code
 *  </custom critical rate>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial rate of the battler when using
 *   a skill.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical rate: 15>
 *         result = a.agi / 10
 *        </custom critical rate>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Defense (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <critical defense: x>
 *  <critical defense: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Change the critial damage received by the battler.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical defense: +50%>
 *       <critical defense: -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Defense (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <critical defense: x>
 *  <critical defense: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Change the critial damage received by the battler.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical defense: +50%>
 *       <critical defense: -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Defense (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <custom critical defense>
 *   result = code
 *  </custom critical defense>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial damage received by the battler.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical defense>
 *         result = a.def * 2
 *        </custom critical defense>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Code (notetag for Actor, Class, Enemy, Weapon, Armor, State)
 * ---------------------------------------------------------------------------
 *  <custom critical code>
 *   code
 *  </custom critical code>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Executes a script code when hit a critical attack.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical code>
 *         if (Math.random() < 0.5) {
 *           b.addState(5);
 *         }
 *        </custom critical code>
 *
 *        <custom critical code>
 *         v[10]++;
 *        </custom critical code>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Damage (notetag for Skill and Item)
 * ---------------------------------------------------------------------------
 *  <critical damage: x>
 *  <critical damage: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Changes the critial damage dealt by the skill or item.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical damage: +50%>
 *       <critical damage: -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Damage (notetag for Skill and Item)
 * ---------------------------------------------------------------------------
 *  <custom critical damage>
 *   result = code
 *  </custom critical damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial damage dealt by the skill or
 *   item.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical damage>
 *         result = a.atk * 4
 *        </custom critical damage>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Rate (notetag for Skill and Item)
 * ---------------------------------------------------------------------------
 *  <critical rate: x>
 *  <critical rate: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Changes the critial damage dealt by the skill or item.
 *    x : value changed. (can be negative or a % value)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical damage: +50%>
 *       <critical damage: -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Rate (notetag for Skill and Item)
 * ---------------------------------------------------------------------------
 *  <custom critical rate>
 *   result = code
 *  </custom critical rate>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Process a script code to change the critial damage dealt by the skill or
 *   item.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical rate>
 *         result = a.agi / 10
 *        </custom critical rate>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Skill (notetag for Skill and Item)
 * ---------------------------------------------------------------------------
 *  <critical skill: x>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Uses the skill set instead of the current skill. Requires the the plugin
 *   command 'Early Critical Check' to be turned ON.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <critical skill: 10>
 *       <critical skill: 15>
 * ===========================================================================
 *
 * ===========================================================================
 *  Critical Code (notetag for Skill and Item)
 * ---------------------------------------------------------------------------
 *  <custom critical code>
 *   code
 *  </custom critical code>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   Executes a script code when hit a critical attack with the skill or item.
 *     code : code that will return the value changed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.:  <custom critical code>
 *         if (Math.random() < 0.5) {
 *           b.addState(5);
 *         }
 *        </custom critical code>
 *
 *        <custom critical code>
 *         v[10]++;
 *        </custom critical code>
 * ===========================================================================
 *
 * ===========================================================================
 * Additional Information:
 * ---------------------------------------------------------------------------
 *
 *  - Code
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "b" for the target, "v[x]" for variable and "item" for the item
 *  object, except for critical defense.  For critical defense, "a" stand for
 *  the target and "b" for the user. The 'result' must return a numeric value,
 *  except for the tag <custom critical code>, wich don't require a result.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Base Critical Damage
 *  This rate is added to the normal damage rate when dealing critical damage
 *  It's a rate value added to the base damage, so 100 = double damage (since
 *  the normal attack deals 100% damage, +100% from the critical = 200%)
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Early Critical Check
 *  By default, the critical check is done right before the damage calculation.
 *  This makes hard for do things that are based on criticals, for example
 *  changing the animation for critical attacks. This setting allows you to
 *  make the critical check to be made before the action is actually executed.
 *  Since the calculation is made before the hit calculation, the critical
 *  attack still have a change of missing, unless 'Never Miss Critical' is ON.
 *
 *  You can check for critical actions with the code 'action.isCritical()' where
 *  'action' must be a valid 'Game_Action' object. (If you don't know what this
 *  means, avoid messing with this).
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Critical Rate
 *  Critical Rate % values will be multiplied by the current critical rate of
 *  the batter. So a battler with 15% critical rate, and +100% additional will
 *  have 30% critical. Flat and code values for critical rates are added to
 *  the total value.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Critical Damage
 *  Critical Damage rate stacks, so a base value of 200% + a skill that
 *  increase 50% will result in a 250% additional damage.
 *  If the value is flat or a code value, it directly added to the damage when
 *  it is a critical.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Critical Defense
 *  The Critical Defense value is a value of reduction over the Critical
 *  Damage value. So it will reduce the additional value granted by the
 *  critical, but never the normal damage value.
 *  If the value is flat or a code value, it will be directly subtracted
 *  from the critical damage additional.
 *
 *  For example, an attack that deals 1000 damage, with 250% of critical damage
 *  would deal 3500 damage (1000 + 1000 * 250%). The critical defense will have
 *  effect only over the 2500 additional. So an 50% critical defense will reduce
 *  the 2500 by half: to 1250 additional damage. Wich will result in a final
 *  damage of 2250 (1000 + 1000 + 1250)
 *  A Critical Defense of 100% will nullify the critical additional damage, so
 *  the damage will be the same of a non critical attack.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Critical Code
 *  You can make script calls when deal critical damage. The code uses the same
 *  values as the damage formula, so you can use "a" for the user, "b" for the
 *  target and "v[x]" for variable.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Critical Skills
 *  The tag <critical skill> allows you to make a different skill to be used
 *  when you successfully lands a critical hit. The targets of the skill will not
 *  change, even if it have a different scope than the original skill. The action
 *  used will be always a skill, even if the original action was an item.
 *  The cost of the new skill is not consumed, as the action is replaced after
 *  the costs are paid.
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  Compatibility:
 * ---------------------------------------------------------------------------
 *  To be used together with this plugin, the following plugins must be placed
 *  bellow this plugin:
 *     VE - Hif Formula
 *     VE - Action Dodge
 * ===========================================================================
 *
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2015.12.28 > First release.
 *  v 1.01 - 2016.03.04 > Improved code for better handling script codes.
 *  v 1.02 - 2016.08.29 > Fixed issue with Early Critical check.
 * ===========================================================================
 */

/*:ja
 * @plugindesc v1.02 - クリティカルヒットとクリティカルダメージを制御できます
 * @author Victor Sant
 *
 * @param Base Critical Damage
 * @text 基本クリティカルダメージ
 * @desc クリティカルダメージに対する追加のダメージ率
 * デフォルト: 100
 * @default 100
 *
 * @param Early Critical Check
 * @text アクション前クリティカル確認
 * @type boolean
 * @on 確認する
 * @off 確認しない
 * @desc アクションが実行される前に、クリティカルの確認を行う
 * 確認する:true / 確認しない:false
 * @default false
 *
 * @param Never Miss Critical
 * @text クリティカル攻撃が必中
 * @type boolean
 * @on 必中
 * @off ミスあり
 * @desc 'Early Critical Check'(アクション前クリティカル確認)がオンの場合、クリティカル攻撃は必中。必中:true / ミスあり:false
 * @default false
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 * 
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/critical-hit-effects/
 * ===========================================================================
 * 必要プラグイン
 * ===========================================================================
 * 
 * このプラグインを使用するには、下記のプラグインが必要です。
 * - VE_BasicModule
 *
 * ===========================================================================
 *  クリティカルダメージ (アクター、職業、敵、武器、防具、ステートのメモタグ)
 * ---------------------------------------------------------------------------
 *  <critical damage: x>
 *  <critical damage: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  バトラーが与える全てのクリティカルダメージを変更
 *    x : 値(負の値または%値を指定可能)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:  <critical damage: +50%>
 *       <critical damage: -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  クリティカルダメージ (アクター、職業、敵、武器、防具、ステートのメモタグ)
 * ---------------------------------------------------------------------------
 *  <critical damage: x, y>
 *  <critical damage: x, y%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   特定のスキルを使用する時、バトラーが与えるクリティカルダメージを変更
 *
 *     x : スキルID
 *     y : 値(負の値または%値を指定可能)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:  <critical damage: 10, +50%>
 *       <critical damage: 15, -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  クリティカルダメージ (アクター、職業、敵、武器、防具、ステートのメモタグ)
 * ---------------------------------------------------------------------------
 *  <custom critical damage>
 *   result = code
 *  </custom critical damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   スクリプトで、バトラーが与えるクリティカルダメージを変更
 *     code : 変更された値を返すコード
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:   <custom critical damage>
 *         result = a.atk * 4
 *        </custom critical damage>
 * ===========================================================================
 *
 * ===========================================================================
 *  会心率 (アクター、職業、敵、武器、防具、ステートのメモタグ)
 * ---------------------------------------------------------------------------
 *  <critical rate: x>
 *  <critical rate: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  バトラーの会心率を変更
 *    x : 値(負の値または%値を指定可能)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:  <critical rate: +50%>
 *       <critical rate: -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  会心率 (アクター、職業、敵、武器、防具、ステートのメモタグ)
 * ---------------------------------------------------------------------------
 *  <critical rate: x, y>
 *  <critical rate: x, y%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   特定のスキルを使用する場合、バトラーの会心率を変更します。
 *     x : スキルID
 *     y : 値(負の値または%値を指定可能)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:  <critical rate: 10, +50%>
 *       <critical rate: 15, -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  会心率 (アクター、職業、敵、武器、防具、ステートのメモタグ)
 * ---------------------------------------------------------------------------
 *  <custom critical rate>
 *   result = code
 *  </custom critical rate>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   スクリプトで、戦闘の会心率を変更
 *     code : 変更された値を返すコード
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:   <custom critical rate>
 *         result = a.agi / 10
 *        </custom critical rate>
 * ===========================================================================
 *
 * ===========================================================================
 *  会心防御 (アクター、職業、敵、武器、防具、ステートのメモタグ)
 * ---------------------------------------------------------------------------
 *  <critical defense: x>
 *  <critical defense: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  バトラーが受けるクリティカルダメージを変更
 *    x : 値(負の値または%値を指定可能)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:  <critical defense: +50%>
 *       <critical defense: -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  会心防御 (アクター、職業、敵、武器、防具、ステートのメモタグ)
 * ---------------------------------------------------------------------------
 *  <custom critical defense>
 *   result = code
 *  </custom critical defense>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   スクリプトでバトラーが受けるクリティカルダメージを変更
 *     code : 変更された値を返すコード
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:   <custom critical defense>
 *         result = a.def * 2
 *        </custom critical defense>
 * ===========================================================================
 *
 * ===========================================================================
 *  クリティカルコード (アクター、職業、敵、武器、防具、ステートのメモタグ)
 * ---------------------------------------------------------------------------
 *  <custom critical code>
 *   code
 *  </custom critical code>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   クリティカルヒットを受けた時にスクリプトコードを実行
 *     code : 変更された値を返すコード
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:   <custom critical code>
 *         if (Math.random() < 0.5) {
 *           b.addState(5);
 *         }
 *        </custom critical code>
 *
 *        <custom critical code>
 *         v[10]++;
 *        </custom critical code>
 * ===========================================================================
 *
 * ===========================================================================
 *  クリティカルダメージ (スキル、アイテムのメモタグ)
 * ---------------------------------------------------------------------------
 *  <critical damage: x>
 *  <critical damage: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   スキル/アイテムが与えるクリティカルダメージを変更
 *    x : 値(負の値または%値を指定可能)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:  <critical damage: +50%>
 *       <critical damage: -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  クリティカルダメージ (スキル、アイテムのメモタグ)
 * ---------------------------------------------------------------------------
 *  <custom critical damage>
 *   result = code
 *  </custom critical damage>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   スクリプトでスキル/アイテムが与えるクリティカルダメージを変更
 *     code : 変更された値を返すコード
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:   <custom critical damage>
 *         result = a.atk * 4
 *        </custom critical damage>
 * ===========================================================================
 *
 * ===========================================================================
 *  会心率 (スキル、アイテムのメモタグ)
 * ---------------------------------------------------------------------------
 *  <critical rate: x>
 *  <critical rate: x%>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   スキル/アイテムが与える会心率を変更
 *    x : 値(負の値または%値を指定可能)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:  <critical damage: +50%>
 *       <critical damage: -25>
 * ===========================================================================
 *
 * ===========================================================================
 *  会心率 (スキル、アイテムのメモタグ)
 * ---------------------------------------------------------------------------
 *  <custom critical rate>
 *   result = code
 *  </custom critical rate>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   スクリプトでスキル/アイテムが与える会心率を変更
 *     code : 変更された値を返すコード
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:   <custom critical rate>
 *         result = a.agi / 10
 *        </custom critical rate>
 * ===========================================================================
 *
 * ===========================================================================
 *  クリティカルスキル (スキル、アイテムのメモタグ)
 * ---------------------------------------------------------------------------
 *  <critical skill: x>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   現在のスキルの代わりにスキルセットを使用します。
 *   パラメーター'Early Critical Check'(アクション前クリティカル確認)を
 *   オンにする必要があります。
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:  <critical skill: 10>
 *       <critical skill: 15>
 * ===========================================================================
 *
 * ===========================================================================
 *  クリティカルコード (スキル、アイテムのメモタグ)
 * ---------------------------------------------------------------------------
 *  <custom critical code>
 *   code
 *  </custom critical code>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   スキル/アイテムでクリティカルヒットを受けた時にスクリプトコードを実行
 *     code : 変更された値を返すコード
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例:   <custom critical code>
 *         if (Math.random() < 0.5) {
 *           b.addState(5);
 *         }
 *        </custom critical code>
 *
 *        <custom critical code>
 *         v[10]++;
 *        </custom critical code>
 * ===========================================================================
 *
 * ===========================================================================
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 *  - Code
 *  コードはダメージの式と同じ値を使用するため、
 *  会心防御を除き、使用者は'a'、対象は'b'、変数は'v[x]'、
 *  アイテムは'item'を使用できます。
 *  会心防御の場合、'a'は対象を表し、'b'は使用者を表します。
 *  'result'は数値を返す必要があります。
 *  <custom critical code>タグではresultは不要です。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Base Critical Damage (基本クリティカルダメージ)
 *  このレートは、クリティカルダメージを与える時、
 *  通常のダメージレートに追加されます。
 *  基本ダメージに追加されるレート値なので、100=二重ダメージです。
 *  (通常の攻撃は100%のダメージを与えるため、クリティカルから+100%=200%)
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Early Critical Check
 *  デフォルトでは、クリティカル計算はダメージ計算の直前に行われます。
 *  例えば、クリティカル攻撃に合わせてアニメーションを変更するなど、
 *  クリティカルに基づいた行動を困難にします。
 *  この設定により、
 *  アクションが実際に実行される前にクリティカル確認を行うことができます。
 *  計算はヒット計算の前に行われるため、
 *  'Never Miss Critical'(クリティカル攻撃が必中)がオンになっていない限り、
 *  クリティカル攻撃のミスはまだ変化しています。
 *
 *  コード'action.isCritical()'でクリティカルアクションを確認できます。
 *  'action'は有効な'Game_Action'オブジェクトである必要があります。
 *  (この意味が分からない場合、これに触れないでください)。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Critical Rate
 *  クリティカル率%の値は、バトラーの現在のクリティカル率で乗算されます。
 *  したがって、クリティカル率が15%で、追加で+100%のバトラーは、
 *  クリティカル率が30%になります。
 *  クリティカル率のフラット/コード値が合計値に追加されます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Critical Damage
 *  クリティカルダメージレートは積み重ねるため、
 *  200%の基本値+50%増加するスキルは、250%の追加ダメージになります。
 *  値がフラット/コード値である場合、それがクリティカルな場合、
 *  直接ダメージに追加されます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Critical Defense
 * クリティカル防御値は、クリティカルダメージ値に対する減少の値です。
 * したがって、クリティカルによって付与される追加の値は減少しますが、
 * 通常のダメージ値は減少しません。
 * 値がフラット/コード値の場合、
 * 追加のクリティカルダメージから直接減算されます。
 *
 *  例えば、1000ダメージを与え、250%のクリティカルダメージを与える攻撃は、
 *  3500ダメージ(1000+1000*250%)を与えます。
 *  クリティカル防御は、追加の2500を超える場合、
 *  のみ効果があります。
 *  したがって、50%のクリティカル防御は、2500を半減し、
 *  追加ダメージを1250に減らします。
 *  最終的なダメージは2250(1000+1000+1250)です。
 *  クリティカル防御が100%の場合、クリティカルな追加ダメージは無効になります。
 *  ダメージはクリティカルではない攻撃と同じになります。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Critical Code
 *  クリティカルダメージを与えた時、スクリプトを呼び出すことができます。
 *  このコードは、ダメージの式と同じ値を使用するため、
 *  使用者に'a'、対象に'b'、変数に'v[x]'を使用できます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Critical Skills
 *  タグ<critical skill>を使用すると、クリティカルヒットを成功させた時、
 *  使用する別のスキルを作成できます。
 *  スキルの対象は、元のスキルと異なる範囲を持っている場合でも変更されません。
 *  元のアクションがアイテムであったとしても、
 *  使用されるアクションは常にスキルになります。
 *  アクションはコストが支払われた後に置き換えられるため、
 *  新しいスキルのコストは消費されません。
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  互換性
 * ---------------------------------------------------------------------------
 *  このプラグインと一緒に使用するには、
 *  このプラグインの下に次のプラグインを配置する必要があります。
 *     VE - Hif Formula
 *     VE - Action Dodge
 * ===========================================================================
 *
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2015.12.28 > First release.
 *  v 1.01 - 2016.03.04 > Improved code for better handling script codes.
 *  v 1.02 - 2016.08.29 > Fixed issue with Early Critical check.
 * ===========================================================================
 */

(function() {

	//============================================================================
	// Parameters
	//============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.CriticalHitEffects = {};
		VictorEngine.Parameters.CriticalHitEffects.BaseDamage    = Number(parameters["Base Critical Damage"]);
		VictorEngine.Parameters.CriticalHitEffects.EarlyCritical = eval(parameters["Early Critical Check"]);
		VictorEngine.Parameters.CriticalHitEffects.NeverMiss     = eval(parameters["Never Miss Critical"]);
	};

	//============================================================================
	// VictorEngine
	//============================================================================

	VictorEngine.CriticalHitEffects.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function(data, index) {
		VictorEngine.CriticalHitEffects.loadNotetagsValues.call(this, data, index);
		if (this.objectSelection(index, ['actor', 'class', 'enemy', 'weapon', 'armor', 'state'])) {
			VictorEngine.CriticalHitEffects.loadNotes1(data);
		}
		if (this.objectSelection(index, ['skill', 'item'])) {
			VictorEngine.CriticalHitEffects.loadNotes2(data);
		}
	};

	VictorEngine.CriticalHitEffects.loadNotes1 = function(data) {
		data.criticalEffect = data.criticalEffect || {};
		data.criticalEffect.rate    = data.criticalEffect.rate    || {};
		data.criticalEffect.damage  = data.criticalEffect.damage  || {};
		data.criticalEffect.defense = data.criticalEffect.defense || {};
		data.criticalEffect.code    = data.criticalEffect.code    || {};
		data.criticalEffect.skillrate   = data.criticalEffect.skillrate   || {};
		data.criticalEffect.skilldamage = data.criticalEffect.skilldamage || {};
		this.processNotes(data);
	};

	VictorEngine.CriticalHitEffects.loadNotes2 = function(data) {
		data.criticalEffect = data.criticalEffect || {};
		data.criticalEffect.rate   = data.criticalEffect.rate   || {};
		data.criticalEffect.damage = data.criticalEffect.damage || {};
		data.criticalEffect.code   = data.criticalEffect.code   || {};
		data.criticalEffect.skill  = data.criticalEffect.skill  || {};
		this.processNotes(data);
	};

	VictorEngine.CriticalHitEffects.processNotes = function(data, type) {
		var match;
		var code   = 'critical[ ]*([\\w ]+)'
		var part1  = '(?:(\\d+)[ ]*,[ ]*)?([+-]?\\d+)(\\%)?';
		var part2  = '(?:[ ]*:[ ]*(\\d+))?';
		var regex1 = new RegExp('<' + code + ':[ ]*' + part1 +'[ ]*>', 'gi');
		var regex2 = VictorEngine.getNotesValues('custom ' + code + part2, 'custom ' + code);
		while (match = regex1.exec(data.note)) {
			this.processValues(data, match, false);
		};
		while (match = regex2.exec(data.note)) {
			this.processValues(data, match, true);
		};
	};

	VictorEngine.CriticalHitEffects.processValues = function(data, match, code) {
		var result = {};
		var type   = (match[2] ? 'skill' : '') + match[1].toLowerCase();
		result.id    = Number(match[2]) || 0;
		result.rate  = !code && match[4] ? Number(match[3]) || 0 : 0;
		result.flat  = !code && match[4] ? 0 : Number(match[3]) || 0;
		result.code  = code ? String(match[3]).trim() : '';
		data.criticalEffect[type] = result;
	};

	//============================================================================
	// Game_BattlerBase
	//============================================================================

	Game_BattlerBase.prototype.criticalCheck = function() {
		return this._criticalCheck;
	};

	Game_BattlerBase.prototype.setCritical = function(value) {
		return this._criticalCheck = value;
	};

	Game_BattlerBase.prototype.criticalRate = function(item, target) {
		var rate = this.cri * this.criRateRate(item) * this.criSkillRateRate(item);
		var flat = this.criRateFlat(item, target) + this.criSkillRateFlat(item, target);
		return rate + flat;
	};

	Game_BattlerBase.prototype.criticalDamage = function(item, target) {
		var base = VictorEngine.Parameters.CriticalHitEffects.BaseDamage / 100;
		var rate = base + this.criDmgRate(item) + this.criSkillDmgRate(item);
		var flat = this.criDmgFlat(item, target) + this.criSkillDmgFlat(item, target);
		var rdef = target.criDefRate();
		var fdef = target.criDefFlat(this);
		return {rate: Math.max(rate * (1 - rdef), 0), flat: Math.max(flat - fdef, 0)};
	};

	Game_BattlerBase.prototype.criRateFlat = function(item, target) {
		var list  = [item].concat(this.traitObjects());
		var value = this.criticalValues(list, 'rate', 'flat');
		var code  = this.criticalCodes(list, 'rate', target);
		return value.concat(code).reduce(function(r, value) {
			return r + (value ? value / 100 : 0);
		}, 0)
	};

	Game_BattlerBase.prototype.criRateRate = function(item) {
		var list  = [item].concat(this.traitObjects());
		var value = this.criticalValues(list, 'rate', 'rate');
		return value.reduce(function(r, value) {
			return r * (value ? value / 100 : 1);
		}, 1)
	};

	Game_BattlerBase.prototype.criDmgFlat = function(item, target) {
		var list  = [item].concat(this.traitObjects());
		var value = this.criticalValues(list, 'damage', 'flat');
		var code  = this.criticalCodes(list, 'damage', target);
		return value.concat(code).reduce(function(r, value) {
			return r + (value ? value : 0);
		}, 0)
	};

	Game_BattlerBase.prototype.criDmgRate = function(item) {
		var list  = [item].concat(this.traitObjects());
		var value = this.criticalValues(list, 'damage', 'rate');
		return value.reduce(function(r, value) {
			return r + (value ? value / 100 : 1);
		}, 0)
	};

	Game_BattlerBase.prototype.criSkillRateFlat = function(item, target) {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'skillrate', 'flat');
		var code  = this.criticalCodes(list, 'skillrate', target);
		return value.concat(code).reduce(function(r, value) {
			return r + (value[item.id] ? value[item.id] / 100 : 0);
		}, 0)
	};

	Game_BattlerBase.prototype.criSkillRateRate = function(item) {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'skillrate', 'rate');
		return value.reduce(function(r, value) {
			return r * (value[item.id] ? value[item.id] / 100 : 1);
		}, 1)
	};

	Game_BattlerBase.prototype.criSkillDmgFlat = function(item, target) {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'skilldamage', 'flat');
		var code  = this.criticalCodes(list, 'skilldamage', target);
		return value.concat(code).reduce(function(r, value) {
			return r + (value[item.id] ? value[item.id] : 0);
		}, 0)
	};

	Game_BattlerBase.prototype.criSkillDmgRate = function(item) {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'skilldamage', 'rate');
		return value.reduce(function(r, value) {
			return r * (value[item.id] ? value[item.id] / 100 : 1);
		}, 1)
	};

	Game_BattlerBase.prototype.criDefFlat = function(subject) {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'defense', 'flat');
		var code  = this.criticalCodes(list, 'defense', subject);
		return value.concat(code).reduce(function(r, value) {
			return r + (value ? value : 0);
		}, 0)
	};

	Game_BattlerBase.prototype.criDefRate = function() {
		var list  = this.traitObjects();
		var value = this.criticalValues(list, 'defense', 'rate');
		return value.reduce(function(r, value) {
			return r + (value ? value / 100 : 1);
		}, 0)
	};

	Game_BattlerBase.prototype.criticalValues = function(list, type, value) {
		return list.reduce(function(r, data) {
			var result = data.criticalEffect[type][value];
			return r.concat(result || []);
		}, []);
	};

	Game_BattlerBase.prototype.criticalCodes = function(list, type, target) {
		var a = this;
		var b = target;
		var v = $gameVariables._data;
		return list.reduce(function(r, data) {
			try {
				var result = '';
				eval(data.criticalEffect[type].code);
				return r.concat(result || []);
			} catch (e) {
				return r;
			}
		}, []);
	};

	Game_BattlerBase.prototype.criticalProcessCodes = function(item) {
		var list = [item].concat(this.traitObjects());
		return list.reduce(function(r, data) {
			var code = data.criticalEffect.code;
			return r.concat(code || []);
		}, []);
	};

	//============================================================================
	// Game_Action
	//============================================================================

	/* Overwritten function */
	Game_Action.prototype.itemCri = function(target) {
		if (target.criticalCheck() !== undefined) {
			var result = target.criticalCheck() ? 1 : 0;
			target.setCritical(undefined);
			return result;
		} else {
			return this.criticalCheck(target);
		}
	};

	/* Overwritten function */
	Game_Action.prototype.applyCritical = function(damage) {
		var flat = this._criticalDamage.flat || 0;
		var rate = this._criticalDamage.rate || 3;
		return damage + Math.max(damage * rate + flat, 0);
	};

	VictorEngine.CriticalHitEffects.apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
		this._criticalDamage = null;
		VictorEngine.CriticalHitEffects.apply.call(this, target);
	}

	VictorEngine.CriticalHitEffects.makeDamageValue = Game_Action.prototype.makeDamageValue;
	Game_Action.prototype.makeDamageValue = function(target, critical) {
		if (critical) this._criticalDamage = this.subject().criticalDamage(this.item(), target);
		return VictorEngine.CriticalHitEffects.makeDamageValue.call(this, target, critical);
	};

	VictorEngine.CriticalHitEffects.applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
	Game_Action.prototype.applyItemUserEffect = function(target) {
		if (this._criticalDamage) this.criticalCodes(target);
		VictorEngine.CriticalHitEffects.applyItemUserEffect.call(this, target);
	};

	VictorEngine.CriticalHitEffects.itemHit = Game_Action.prototype.itemHit;
	Game_Action.prototype.itemHit = function(target) {
		if (target.criticalCheck() && this.neverMissCritical()) {
			return 1;
		} else {
			return VictorEngine.CriticalHitEffects.itemHit.call(this, target);
		}
	};

	VictorEngine.CriticalHitEffects.itemEva = Game_Action.prototype.itemEva;
	Game_Action.prototype.itemEva = function(target) {
		if (target.criticalCheck() && this.neverMissCritical()) {
			return 0;
		} else {
			return VictorEngine.CriticalHitEffects.itemEva.call(this, target);
		}
	};

	VictorEngine.CriticalHitEffects.applyGlobal = Game_Action.prototype.applyGlobal;
	Game_Action.prototype.applyGlobal = function() {
		VictorEngine.CriticalHitEffects.applyGlobal.call(this);
		this.earlyCriticalCheck()
	};

	Game_Action.prototype.neverMissCritical = function() {
		return (VictorEngine.Parameters.CriticalHitEffects.EarlyCritical &&
				VictorEngine.Parameters.CriticalHitEffects.NeverMiss);
	};

	Game_Action.prototype.criticalCheck = function(target) {
		if (this.item().damage.critical) {
			var rate = this.subject().criticalRate(this.item(), target);
			return rate * (1 - target.cev);
		} else {
			return 0;
		}
	};

	Game_Action.prototype.earlyCriticalCheck = function() {
		if (VictorEngine.Parameters.CriticalHitEffects.EarlyCritical && $gameParty.inBattle())  {
			this._isCritical = BattleManager._targets.some(function(target) {
				target.setCritical(undefined);
				target.setCritical(Math.random() < this.itemCri(target));
				return target.criticalCheck();
			}, this);
			if (this.isCritical() && this.item().criticalEffect.skill.id) {
				this.setSkill(this.item().criticalEffect.skill.id);
			}
		}
	};

	Game_Action.prototype.criticalCodes = function(target) {
		var list = this.subject().criticalProcessCodes(this.item(), target);
		var a = this.subject();
		var b = target;
		var v = $gameVariables._data;
		list.forEach(function(obj) {
			if (obj.code) try { eval(obj.code) } catch (e) {};
		}, this);
	};

	Game_Action.prototype.isCritical = function() {
		return this._isCritical;
	};

})();