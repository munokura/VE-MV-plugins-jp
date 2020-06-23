/*
 * ===========================================================================
 * ** Victor Engine MV - Cooperation Skills
 * ---------------------------------------------------------------------------
 *  CooperationSkills.js
 * ===========================================================================
 */

var Imported = Imported || {};
Imported['VE - Cooperation Skills'] = '1.00';

var VictorEngine = VictorEngine || {};
VictorEngine.CooperationSkills = VictorEngine.CooperationSkills || {};

(function() {

    VictorEngine.CooperationSkills.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        VictorEngine.CooperationSkills.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Cooperation Skills', 'VE - Basic Module', '1.22');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Cooperation Skills', 'VE - Skip Battle Log');
    };

    VictorEngine.CooperationSkills.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function(name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
//        } else if (Imported.YEP_BattleEngineCore) {
//            var msg = 'The plugin ' + name + " does not work together with the";
//            msg += ' plugin YEP Battle Engine Core.';
//            throw new Error(msg);
        } else {
            VictorEngine.CooperationSkills.requiredPlugin.call(this, name, required, version);
        };
    };

})();

/*:
 * ===========================================================================
 * @plugindesc v1.00 - Battlers join to execute actions together.
 * @author Victor Sant
 *
 * ===========================================================================
 * @help
 * ===========================================================================
 * Actors, Classes, Enemies, Weapons, Armors and States Notetags:
 * ===========================================================================
 *
 * ===========================================================================
 *  Unite Skill (notetag for Skills)
 * ---------------------------------------------------------------------------
 *  <unite skill: X[, X...]>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Specific actors join to execute the skill.
 *    x: Id of the actors.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <unite skill: 1, 2>
 *       <unite skill: 3, 6, 4>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The order you place the Ids is relevant for the damage formula and if
 *    you're using the Plugin 'VE - Battle Motions' for the action sequence.
 * ===========================================================================
 *
 * ===========================================================================
 *  Fusion Skill (notetag for Skills)
 * ---------------------------------------------------------------------------
 *  <fusion skill: X[, X...]>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  When battlers use the specific skills listed on the same turn, instead, they
 *  will join to execute this skill.
 *    x : skill Id
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <fusion skill: 10, 12>
 *       <fusion skill: 8, 8, 8>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  NOTES:
 *  - The order you place the Ids is relevant for the damage formula and if
 *    you're using the Plugin 'VE - Battle Motions' for the action sequence.
 *  - Using the same id more than once means that more than one battler must use
 *    the same skill.
 * ===========================================================================
 *
 * ===========================================================================
 *  Combination Skill (notetag for Skills)
 * ---------------------------------------------------------------------------
 *  <combination skill: X>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  To execute this skill, more than one battler must use it on the same turn.
 *    x : number of battlers needed.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <combination skill: 3>
 * ===========================================================================
 *
 * ===========================================================================
 * Additional Information:
 * ---------------------------------------------------------------------------
 *
 *  The cooperation skills setup is done at the turn start, right after all
 *  inputs are done. So if a battler that is part of the combination becomes
 *  unable to use the skill, the combination will fizzle and all battlers
 *  involved on it will lose the turn.
 *
 *  The combination actions timing is based on the speed of the slowest battler
 *  involved on it.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Unite Skills
 *  The 'Unite type' requires all actors to have the skill learned and usable.
 *  When you choose the skill for the first actor, all other actors required
 *  will automatically select the same skill.
 *  Unite skills works only for actors.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Fusion Skills
 *  The 'Fusion type' is based on the skills used, if all the skills required are
 *  selected, the actions of the battlers using those skill will be replaced with
 *  the fusion skill. The action is set after all commands are choosen, before
 *  the turn start. The battlers don't need to have the skill learned to use.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Combination Skills
 *  The 'Combination type' is based on the number of battlers using the skill.
 *  If the number of battlers needed is reached, the skill is used. Different
 *  from the unite skill, each battler choose the skill individually.
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  Cooperation Skills and Damage Formula:
 * ---------------------------------------------------------------------------
 *  When the action is used, only the curretly active battler (the one that was
 *  active at the time of the cooperation invocation) parameters are considered.
 *  To have the other battlers parameters to be used on the damage formula, you
 *  can use 'cp[X]' to refer to them, where X is the position of the battler on
 *  the cooperation notetag (for Union skills it's based on the actor Id, for
 *  Fusion skills it's based on the Id of the skill the battler is using, for
 *  Combination skills, it's baed on the order that the actions were choosen).
 *
 *  For example. you have the following notetag:
 *  <unite skill: 3, 6, 4>
 *  - You can use cp[1] for the first actor (the one with id 3)
 *  - You can use cp[2] for the second actor (the one with id 6)
 *  - You can use cp[3] for the third actor (the one with id 4)
 *
 *  You formula can be, for example:
 *  (cp[1].atk + cp[2].atk + cp[3].atk) * 4 - b.def * 2
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  Cooperation Skills and Active Time Battle:
 * ---------------------------------------------------------------------------
 *  If using the plugin 'VE - Active Time Battle', only the Unite type
 *  cooperations will work. Also notice that all necessary battlers must be with
 *  the ATB bar Full, if you use the update modes 'full wait' and 'semi wait',
 *  it might be harder to setup combinations since the ATB will be frozen while
 *  selecting actions. For this reason, its recomended to use only the
 *  'semi active' and 'full active' modes.
 * ===========================================================================
 *
 * ===========================================================================
 *  Cooperation Skills and Battle Motions:
 * ---------------------------------------------------------------------------
 *  If using the plugin 'VE - Battle Motions', you can use new [subject] values
 *  of the motions for cooperation skills.
 *
 * ---------------------------------------------------------------------------
 *  Here are all possible [subjects] values:
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   cooperation X   : the Xth battler participating on the cooperation skill.
 *   all cooperation : all battlers participating on the cooperation skill.
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  - Motion Subjects: Combination X
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  This subject value will choose one of the combination battlers, based on the
 *  type of cooperation and the order of the values on the notetag (similar to
 *  how the damage formula choose the battlers)
 *
 *  For example. you have the following notetag:
 *  <unite skill: 3, 6, 4>
 *  if you use motion 'move: cooperation 2, close to target, 12, 80;'
 *  the second cooperation member (the actor Id 6) will move close to the target
 * ===========================================================================
 *
 * ===========================================================================
 * Compatibility:
 * ---------------------------------------------------------------------------
 * To be used together with this plugin, the following plugins must be placed
 * bellow this plugin:
 *    VE - Skip Battle Log
 * ===========================================================================
 *
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2016.07.20 > First release.
 * ===========================================================================
 */

/*:ja
 * ===========================================================================
 * @plugindesc v1.00 - バトラーが参加して、一緒にアクションを実行します。
 * @author Victor Sant
 *
 * ===========================================================================
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/cooperation-skills/
 * ===========================================================================
 * 必要プラグイン
 * ===========================================================================
 *
 * このプラグインを使用するには、下記のプラグインが必要です。
 * - VE_BasicModule
 *
 * ===========================================================================
 * アクター、職業、敵、武器、防具、ステートのメモタグ
 * ===========================================================================
 *
 * ===========================================================================
 *  団結スキル (スキルのメモタグ)
 * ---------------------------------------------------------------------------
 *  <unite skill: X[, X...]>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  特定のアクターが参加してスキルを実行します。
 *    x: アクターID
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例: <unite skill: 1, 2>
 *      <unite skill: 3, 6, 4>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  注:
 *  - アクションシーケンスに'VE_BattleMotions'プラグインを使用している場合、
 *    IDを配置する順序は、ダメージ式に関連しています。
 * ===========================================================================
 *
 * ===========================================================================
 *  融合スキル (スキルのメモタグ)
 * ---------------------------------------------------------------------------
 *  <fusion skill: X[, X...]>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * バトラーが同じターンに登録されている特定のスキルを使用する場合、
 * 彼らはこのスキルを実行するために参加します。
 *    x : スキルID
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例: <fusion skill: 10, 12>
 *      <fusion skill: 8, 8, 8>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  注:
 *  - アクションシーケンスに'VE_BattleMotions'プラグインを使用している場合、
 *    IDを配置する順序は、ダメージ式に関連しています。
 *  - 同じIDを複数回使用すると
 *    複数のバトラーが同じスキルを使用する必要があることを意味します。
 * ===========================================================================
 *
 * ===========================================================================
 *  組み合わせスキル (スキルのメモタグ)
 * ---------------------------------------------------------------------------
 *  <combination skill: X>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  このスキルは、複数のバトラーが同じターンに使用する必要があります。
 *    x : 必要なバトラーの数
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例: <combination skill: 3>
 * ===========================================================================
 *
 * ===========================================================================
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 *  協力スキルの設定は、全ての入力が完了した直後のターン開始時に行われます。
 *  コンビネーションの一部であるバトラーがスキルを使用できなくなった場合、
 *  そのコンビネーションは起動し、関与する全てのバトラーがターンを失います。
 *
 *  組み合わせアクションのタイミングは、
 *  それに関与する最も遅いバトラーの速度に基づいています。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - 団結スキル
 *  団結スキルは、
 *  全てのアクターがスキルを習得して使用可能にする必要があります。
 *  最初のアクターのスキルを選択すると、
 *  必要な他の全てのアクターが自動的に同じスキルを選択します。
 *  団結スキルはアクターに対してのみ機能します。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - 融合スキル
 *  融合スキルは使用されるスキルに基づいており、
 *  必要な全てのスキルが選択されている場合、
 *  スキルを使用するバトラーのアクションは融合スキルに置き換えられます。
 *  アクションは、全てのコマンドが選択された後、ターン開始前に設定されます。
 *  バトラーはスキルを習得している必要はありません。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - 組み合わせスキル
 *  組み合わせスキルは、 スキルを使用するバトラーの数に基づいています。
 *  必要なバトラーの数に達すると、スキルが使用されます。
 *  団結スキルとは異なり、各バトラーは個別にスキルを選択します。
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  協力スキルとダメージ式
 * ---------------------------------------------------------------------------
 * アクションが使用される場合、
 * 有効なバトラー(協力発動時に活動可能者)のパラメーターのみが考慮されます。
 *  ダメージ式で他のバトラーのパラメーターを使用するには、
 * 'cp[X]'を使用してそれらを参照します。
 * Xは協力メモタグ上のバトラーの位置です。
 *
 * (団結スキルの場合、アクターIDに基づいており、
 * 融合スキルの場合、バトラーが使用しているスキルのIDに基づいています。
 * 組み合わせスキルの場合、アクションが選択された順序に基づいています。
 *
 *  例:下記のメモタグ
 *  <unite skill: 3, 6, 4>
 *  - 1番目のアクター(id3のアクター)にcp[1]を使用できます
 *  - 2番目のアクター(id6のアクター)にcp[2]を使用できます
 *  - 3番目のアクター(id4のアクター)にcp[3]を使用できます
 *
 *  数式は次のようになります。
 *  (cp[1].atk + cp[2].atk + cp[3].atk) * 4 - b.def * 2
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  協力スキルとアクティブタイムバトル
 * ---------------------------------------------------------------------------
 *  プラグイン'VE- ActiveTimeBattle'を使用する場合、
 *  団結スキルの連携のみが機能します。
 *  また、全ての必要なバトラーのATBバーが
 *  フルである必要があることに注意してください。
 *  モード'full wait'および'semi wait'を使用する場合、
 *  アクションの選択中にATBがフリーズするため、
 *  組み合わせをセットアップするのが難しい場合があります。
 *
 *  モード'semi active'、'full active'のみを使用することをお勧めします。
 * ===========================================================================
 *
 * ===========================================================================
 *  協力スキルとバトルモーション
 * ---------------------------------------------------------------------------
 *  'VE-BattleMotions'プラグインを使用する場合、
 *  協力スキルにモーションの新しい[subjects]値を使用できます。
 *
 * ---------------------------------------------------------------------------
 *  全ての使用可能な[subjects]値は次のとおりです。
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *   cooperation X   : 協力スキルに参加しているX番目のバトラー。
 *   all cooperation : 協力スキルに参加している全てのバトラー。
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  -モーション[subjects]:組み合わせX
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * このsubjectsの値は、協力のタイプとメモタグの値の順序に基づいて、
 * コンビネーションバトラーの1つを選択します
 * (ダメージ式がバトラーを選択する方法と同様)。
 *
 *  例:下記のメモタグ
 *  <unite skill: 3, 6, 4>
 *  モーション'move: cooperation 2, close to target, 12, 80;'を使用すると、
 *  2番目の協力メンバー(アクターID6)は対象の近くに移動します。
 * ===========================================================================
 *
 * ===========================================================================
 * 互換性
 * ---------------------------------------------------------------------------
 * このプラグインと一緒に使用するには、
 * このプラグインの下に次のプラグインを配置する必要があります。
 *    VE - Skip Battle Log
 * ===========================================================================
 *
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2016.07.20 > First release.
 * ===========================================================================
 */

(function() {

    //============================================================================
    // Parameters
    //============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.CooperationSkills = {};
        VictorEngine.Parameters.CooperationSkills.PluginParameter = Number(parameters["Plugin Parameter"]) || 0;
        VictorEngine.Parameters.CooperationSkills.PluginParameter = String(parameters["Plugin Parameter"]).trim();
        VictorEngine.Parameters.CooperationSkills.PluginParameter = eval(parameters["Plugin Parameter"]);
    }

    //============================================================================
    // VictorEngine
    //============================================================================

    VictorEngine.CooperationSkills.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function(data, index) {
        VictorEngine.CooperationSkills.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['skill'])) {
            VictorEngine.CooperationSkills.loadNotes(data);
        }
    };

    VictorEngine.CooperationSkills.loadNotes = function(data) {
        data.cooperationSkill = data.cooperationSkill || {};
        this.processNotes(data);
    };

    VictorEngine.CooperationSkills.processNotes = function(data, type) {
        var match;
        var regex1 = new RegExp('<unite skill:[ ]*((?:\\d+[ ]*,?[ ]*)+)[ ]*>', 'gi');
        var regex2 = new RegExp('<fusion skill:[ ]*((?:\\d+[ ]*,?[ ]*)+)[ ]*>', 'gi');
        var regex3 = new RegExp('<combination skill:[ ]*(\\d+)[ ]*>', 'gi');
        while (match = regex1.exec(data.note)) {
            data.cooperationSkill.unite = this.processValues(data, match);
        };
        while (match = regex2.exec(data.note)) {
            data.cooperationSkill.fusion = this.processValues(data, match);
        };
        while (match = regex3.exec(data.note)) {
            data.cooperationSkill.combination = Number(match[1]);
        };
        var skill = data.cooperationSkill;
        var isUnite = skill.unite && skill.unite.length > 1;
        var isFusion = skill.fusion && skill.fusion.length > 1;
        var isCombination = skill.combination && skill.combination > 1;
        data.isCooperation = isUnite || isFusion || isCombination;
    };

    VictorEngine.CooperationSkills.processValues = function(data, match) {
        return match[1].split(/[ ]*,[ ]*/gi).map(function(value) {
            return Number(value);
        });
    };

    //============================================================================
    // BattleManager
    //============================================================================

    VictorEngine.CooperationSkills.startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function() {
        if (!Imported['VE - Active Time Battle']) {
            this.prepareCombinationActions();
        }
        VictorEngine.CooperationSkills.startTurn.call(this);
    };

    VictorEngine.CooperationSkills.startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        if (Imported['VE - Active Time Battle']) {
            this.setupUnionSkills();
        }
        VictorEngine.CooperationSkills.startAction.call(this);
    };

    BattleManager.prepareCombinationActions = function() {
        this.setupUnionSkills();
        this.setupFusionSkills();
        this.setupCombinationSkills();
    };

    BattleManager.setupUnionSkills = function() {
        $gameParty.members().forEach(function(member) {
            if (member.uniteLeaderSkill()) {
                member.setupUniteBaltters();
            }
        });
    };

    BattleManager.setupFusionSkills = function() {
        for (var i = 1; i < $dataSkills.length; i++) {
            var skill = $dataSkills[i]
            if (skill.cooperationSkill.fusion) {
                this.setupFusionBattlers(skill, $gameParty.members());
                this.setupFusionBattlers(skill, $gameTroop.members());
            }
        };
        this.allBattleMembers().forEach(function(member) {
            if (member.fusionLeaderSkill()) {
                member.setupFusionBaltters();
            }
        });
    };

    BattleManager.setupCombinationSkills = function() {
        for (var i = 1; i < $dataSkills.length; i++) {
            var skill = $dataSkills[i]
            if (skill.cooperationSkill.combination) {
                this.setupCombinationBattlers(skill, $gameParty.members());
                this.setupCombinationBattlers(skill, $gameTroop.members());
            }
        };
        this.allBattleMembers().forEach(function(member) {
            if (member.combinationLeaderSkill()) {
                member.setupCombinationBaltters();
            }
        });
    };

    BattleManager.setupFusionBattlers = function(skill, members) {
        for (var i = 0; i < members.length; i++) {
            var fusion = this.getFusionList(skill, members);
            if (fusion.length === skill.cooperationSkill.fusion.length) {
                fusion[0].member.setFusionLeader(skill, fusion[0].id);
                for (var j = 1; j < fusion.length; j++) {
                    fusion[j].member.setFusionMember(fusion[0].member, fusion[j].id);
                };
            }
        }
    };

    BattleManager.getFusionList = function(skill, members) {
        var fusion = [];
        var skills = skill.cooperationSkill.fusion;
        for (var i = 0; i < skills.length; i++) {
            var id = skills[i];
            var member = this.getFusionMember(members, fusion, id);
            if (member) {
                fusion.push({
                    member: member,
                    id: id
                });
            }
        };
        return fusion;
    };

    BattleManager.getFusionMember = function(members, fusion, id) {
        for (var i = 0; i < members.length; i++) {
            var member = members[i];
            if (this.notFusionMember(fusion, member) && member.isUsingFusion(id)) {
                return member;
            }
        };
        return null;
    };

    BattleManager.notFusionMember = function(fusions, member) {
        return fusions.every(function(fusion) {
            return fusion.member !== member;
        })
    };

    BattleManager.setupCombinationBattlers = function(skill, members) {
        for (var i = 0; i < members.length; i++) {
            var combination = this.getCombinationList(skill, members);
            if (combination.length === skill.cooperationSkill.combination) {
                combination[0].setCombinationLeader(skill);
                for (var j = 1; j < combination.length; j++) {
                    combination[j].setCombinationMember(combination[0]);
                };
            }
        };
    };

    BattleManager.getCombinationList = function(skill, members) {
        var combination = [];
        var skills = skill.cooperationSkill.combination;
        for (var i = 0; i < skills; i++) {
            var member = this.getCombinationMember(members, combination, skill.id);
            if (member) {
                combination.push(member);
            }
        };
        return combination;
    };

    BattleManager.getCombinationMember = function(members, combination, id) {
        for (var i = 0; i < members.length; i++) {
            var member = members[i];
            if (!combination.contains(member) && member.isUsingCombination(id)) {
                return member;
            }
        };
        return null;
    };

    //============================================================================
    // Game_Action
    //============================================================================

    /* Overwritten function */
    Game_Action.prototype.evalDamageFormula = function(target) {
        try {
            var item = this.item();
            var a = this.subject();
            var b = target;
            var v = $gameVariables._data;
            var cp = this.cooperationBattlersFormula();
            var formula = VictorEngine.getDamageFormula(this);
            var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
            return (Math.max(eval(formula), 0) * sign) || 0;
        } catch (e) {
            return 0;
        }
    };

    VictorEngine.CooperationSkills.isValid = Game_Action.prototype.isValid;
    Game_Action.prototype.isValid = function() {
        return VictorEngine.CooperationSkills.isValid.call(this) && !this.subject().cooperationMember() &&
            this.isCombinationOk();
    };

    Game_Action.prototype.setCooperationBattlers = function() {
        this._cooperationBattlers = this.cooperationActionBattlers();
    };

    Game_Action.prototype.cooperationBattlers = function() {
        return this._cooperationBattlers || [];
    };

    Game_Action.prototype.cooperationBattlersFormula = function() {
        return this.isCooperation() ? [{}].concat(this.cooperationBattlers()) : [];
    };

    Game_Action.prototype.isCooperation = function() {
        return this.item() && this.item().isCooperation;
    };

    Game_Action.prototype.isUniteAction = function() {
        return this.isCooperation() && this.item().cooperationSkill.unite;
    };

    Game_Action.prototype.isFusionAction = function() {
        return this.isCooperation() && this.item().cooperationSkill.fusion;
    };

    Game_Action.prototype.isCombinationAction = function() {
        return this.isCooperation() && this.item().cooperationSkill.combination;
    };

    Game_Action.prototype.cooperationActionBattlers = function() {
        if (this.isUniteAction()) {
            return this.uniteActionBattlers();
        } else if (this.isFusionAction()) {
            return this.fusionActionBattlers();
        } else if (this.isCombinationAction()) {
            return this.combinationActionBattlers();
        }
        return [];
    };

    Game_Action.prototype.cooperationLength = function() {
        if (this.isUniteAction()) {
            return this.item().cooperationSkill.unite.length;
        } else if (this.isFusionAction()) {
            return this.item().cooperationSkill.fusion.length;
        } else if (this.isCombinationAction()) {
            return this.item().cooperationSkill.combination;
        }
        return 0;
    };

    Game_Action.prototype.uniteActionBattlers = function() {
        return this.item().cooperationSkill.unite.map(function(id) {
            return $gameActors.actor(id);
        });
    };

    Game_Action.prototype.fusionActionBattlers = function() {
        var object = this;
        var leader = this.subject();
        var skills = this.item().cooperationSkill.fusion;
        var fusion = [leader];
        for (var i = 1; i < skills.length; i++) {
            var id = skills[i];
            var member = this.getFusionBattler(leader, id, fusion);
            if (member) {
                fusion.push(member);
            }
        }
        return fusion;
    };

    Game_Action.prototype.getFusionBattler = function(leader, id, fusion) {
        var members = BattleManager.allBattleMembers();
        for (var i = 0; i < members.length; i++) {
            var member = members[i];
            if (member.isOriginalFusionSkill(id) && member.fusionLeader() === leader &&
                !fusion.contains(member)) {
                return member;
            }
        }
        return null;
    };

    Game_Action.prototype.combinationActionBattlers = function() {
        var object = this;
        var leader = this.subject();
        var combination = [leader];
        for (var i = 1; i < this.item().cooperationSkill.combination; i++) {
            var member = this.getCombinationBattler(leader, combination);
            if (member) {
                combination.push(member);
            }
        }
        return combination;
    };

    Game_Action.prototype.getCombinationBattler = function(leader, combination) {
        var members = BattleManager.allBattleMembers();
        for (var i = 0; i < members.length; i++) {
            var member = members[i];
            if (member.combinationLeader() === leader && !combination.contains(member)) {
                return member;
            }
        }
        return null;
    };

    Game_Action.prototype.isCombinationOk = function() {
        if (this.isCombinationAction()) {
            if (this.subject().combinationLeaderSkill()) {
                return this.combinationMembersOk();
            } else {
                return false;
            }
        } else {
            return true;
        };
    };

    Game_Action.prototype.combinationMembersOk = function() {
        var skill = this.item();
        return this.cooperationBattlers().every(function(member) {
            return member.canUse(skill);
        })
    };

    //============================================================================
    // Game_BattlerBase
    //============================================================================

    VictorEngine.CooperationSkills.paySkillCost = Game_BattlerBase.prototype.paySkillCost;
    Game_BattlerBase.prototype.paySkillCost = function(skill) {
        VictorEngine.CooperationSkills.paySkillCost.call(this, skill);
        if (skill.isCooperation && this.isCooperationSkill(skill)) {
            var user = this;
            this.cooperationBattlers(skill).forEach(function(battler) {
                if (battler !== user) {
                    battler.payCooperationSkillCost(skill);
                }
            });
        }
    };

    VictorEngine.CooperationSkills.canInput = Game_BattlerBase.prototype.canInput;
    Game_BattlerBase.prototype.canInput = function() {
        return VictorEngine.CooperationSkills.canInput.call(this) && !this.uniteLeader();
    };

    VictorEngine.CooperationSkills.meetsSkillConditions = Game_BattlerBase.prototype.meetsSkillConditions;
    Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
        return (VictorEngine.CooperationSkills.meetsSkillConditions.call(this, skill) &&
            this.isSkillCooperationOk(skill));
    };

    Game_BattlerBase.prototype.isSkillCooperationOk = function(skill) {
        return !skill.isCooperation || this.isCooperationOk(skill);
    };

    Game_BattlerBase.prototype.isCooperationOk = function(skill) {
        return this.isUniteOk(skill) || this.isFusionOk(skill) || this.isCombinationOk(skill);
    };

    Game_BattlerBase.prototype.isUniteOk = function(skill) {
        if (this.isEnemy() || !skill.cooperationSkill.unite) {
            return false;
        }
        return this.uniteBattlers(skill).every(function(actor) {
            return actor.isUniteMemberOk(skill) && !actor.isUsingNonUnite() &&
                (!Imported['VE - Active Time Battle'] || actor.atbFull());
        });
    };

    Game_BattlerBase.prototype.isFusionOk = function(skill) {
        if (!$gameParty.inBattle() || !skill.cooperationSkill.fusion) {
            return false;
        }
        return this.fusionBattlers(skill).every(function(actor) {
            return actor.isFusionMemberOk(actor.originalFusionSkill());
        });
    };

    Game_BattlerBase.prototype.isCombinationOk = function(skill) {
        if (!$gameParty.inBattle() || !skill.cooperationSkill.combination) {
            return false;
        } else {
            return true;
        }
    };

    Game_BattlerBase.prototype.isUniteMemberOk = function(skill) {
        return $gameParty.members().contains(this) && this.hasSkill(skill.id) &&
            VictorEngine.CooperationSkills.meetsSkillConditions.call(this, skill);
    };

    Game_BattlerBase.prototype.isFusionMemberOk = function(skill) {
        return VictorEngine.CooperationSkills.meetsSkillConditions.call(this, skill);
    };

    Game_BattlerBase.prototype.cooperationBattlers = function(skill) {
        if (skill.cooperationSkill.unite) {
            return this.uniteBattlers(skill);
        } else if (skill.cooperationSkill.fusion) {
            return this.fusionBattlers(skill);
        } else if (skill.cooperationSkill.combination) {
            return this.combinationBattlers(skill);
        }
        return [];
    };

    Game_BattlerBase.prototype.uniteBattlers = function(skill) {
        return skill.cooperationSkill.unite.map(function(id) {
            return $gameActors.actor(id);
        });
    };

    Game_BattlerBase.prototype.fusionBattlers = function(skill) {
        if (this.fusionLeaderSkill() === skill) {
            return this.fusionMembersList(this);
        } else if (this.fusionLeader() && this.fusionLeader().fusionLeaderSkill() === skill) {
            return this.fusionMembersList(this.fusionLeader());
        } else {
            return [];
        }
    };

    Game_BattlerBase.prototype.combinationBattlers = function(skill) {
        if (this.combinationLeaderSkill() === skill) {
            return this.combinationMembersList(this);
        } else if (this.combinationLeader() && this.combinationLeader().combinationLeaderSkill() === skill) {
            return this.combinationMembersList(this.combinationLeader());
        } else {
            return [];
        }
    };

    Game_BattlerBase.prototype.fusionMembersList = function(leader) {
        return BattleManager.allBattleMembers().filter(function(member) {
            return member.fusionLeader() === leader || member === leader;
        });
    };

    Game_BattlerBase.prototype.combinationMembersList = function(leader) {
        return BattleManager.allBattleMembers().filter(function(member) {
            return member.combinationLeader() === leader || member === leader;
        });
    };

    Game_BattlerBase.prototype.cooperationMember = function() {
        return this._uniteLeader || this._fusionLeader;
    };

    Game_BattlerBase.prototype.cooperationLeader = function(skill) {
        if (skill.cooperationSkill.unite) {
            return this.uniteLeader();
        } else if (skill.cooperationSkill.fusion) {
            return this.fusionLeader();
        } else if (skill.cooperationSkill.combination) {
            return this.combinationLeader();
        } else {
            return null;
        };
    };

    Game_BattlerBase.prototype.isCooperationSkill = function(skill) {
        return skill.cooperationSkill.unite || skill.cooperationSkill.fusion || skill.cooperationSkill.combination;
    };

    Game_BattlerBase.prototype.payCooperationSkillCost = function(skill) {
        if (skill.cooperationSkill.fusion) {
            if (this.originalFusionSkill()) {
                VictorEngine.CooperationSkills.paySkillCost.call(this, this.originalFusionSkill());
            }
        } else {
            VictorEngine.CooperationSkills.paySkillCost.call(this, skill);
        }
    };

    Game_BattlerBase.prototype.cooperationName = function(skill) {
        var text = ''
        var names = this.cooperationBattlers(skill).map(function(battler) {
            return battler.name();
        });
        for (var i = 0; i < names.length; i++) {
            var name = names[i]
            if (i === 0) {
                text = name;
            } else if (i > 0 && i < names.length - 1) {
                text += ', ' + name;
            } else if (i === names.length - 1) {
                text += ' and ' + name;
            }
        }
        return text;
    };

    Game_BattlerBase.prototype.uniteLeader = function() {
        return this._uniteLeader;
    };

    Game_BattlerBase.prototype.uniteLeaderSkill = function() {
        return this._uniteLeaderSkill;
    };

    Game_BattlerBase.prototype.isUsingNonUnite = function() {
        return this._isUsingNonUnite;
    };

    Game_BattlerBase.prototype.setUniteLeader = function(leader) {
        this._uniteLeader = leader;
    };

    Game_BattlerBase.prototype.setUniteLeaderSkill = function(skill) {
        this._uniteLeaderSkill = skill;
    };

    Game_BattlerBase.prototype.setUsingNonUnite = function() {
        if (this.notUsingUnite()) {
            this._isUsingNonUnite = true;
        }
    };

    Game_BattlerBase.prototype.clearUniteSetup = function() {
        this._uniteLeader = null;
        this._uniteLeaderSkill = null;
        this._isUsingNonUnite = false;
    };

    Game_BattlerBase.prototype.notUsingUnite = function() {
        return this._actions.every(function(action) {
            return !action.isUniteAction();
        })
    };

    Game_BattlerBase.prototype.setupUniteBaltters = function() {
        this._actions.forEach(function(action) {
            if (action.isUniteAction()) {
                action.setCooperationBattlers();
            }
        })
    };

    /* FUSION */
    Game_BattlerBase.prototype.isUsingFusion = function(id) {
        var battler = this;
        return this._actions.some(function(action) {
            return action.item() && action.isSkill() && action.item().id === id && !battler.originalFusionSkill();
        })
    };

    Game_BattlerBase.prototype.fusionLeader = function() {
        return this._fusionLeader;
    };

    Game_BattlerBase.prototype.fusionLeaderSkill = function() {
        return this._fusionLeaderSkill;
    };

    Game_BattlerBase.prototype.originalFusionSkill = function() {
        return this._originalFusionSkill;
    };

    Game_BattlerBase.prototype.isOriginalFusionSkill = function(id) {
        return this._originalFusionSkill && this._originalFusionSkill.id === id;
    };

    Game_BattlerBase.prototype.clearFusionSetup = function() {
        this._fusionLeader = null;
        this._fusionLeaderSkill = null;
        this._originalFusionSkill = null;
    };

    Game_BattlerBase.prototype.setFusionLeader = function(skill, id) {
        this._fusionLeaderSkill = skill;
        this.setFusionAction(skill, id);
    };

    Game_BattlerBase.prototype.setFusionMember = function(leader, id) {
        this._fusionLeader = leader;
        this.setFusionAction(leader.fusionLeaderSkill(), id);
    };

    Game_BattlerBase.prototype.setFusionAction = function(skill, id) {
        var index = this.setFusionActionIndex(id);
        var action = new Game_Action(this);
        action.setSkill(skill.id);
        action.setTarget(this._actions[index]._targetIndex);
        this._actions.splice(index, 1, action);
        this._originalFusionSkill = $dataSkills[id];
    };

    Game_BattlerBase.prototype.setFusionActionIndex = function(id) {
        for (var i = 1; i < this._actions.length; i++) {
            var action = this._actions[i];
            if (action.item() && action.isSkill() && action.item().id === id) {
                return i;
            }
        }
        return 0;
    };

    Game_BattlerBase.prototype.setupFusionBaltters = function() {
        this._actions.forEach(function(action) {
            if (action.isFusionAction()) {
                action.setCooperationBattlers();
            }
        })
    };

    /* Combination */
    Game_BattlerBase.prototype.isUsingCombination = function(id) {
        var battler = this;
        return this._actions.some(function(action) {
            return action.item() && action.isSkill() && action.item().id === id && !battler.isCombinationSkill();
        })
    };

    Game_BattlerBase.prototype.combinationLeader = function() {
        return this._combinationLeader;
    };

    Game_BattlerBase.prototype.combinationLeaderSkill = function() {
        return this._combinationLeaderSkill;
    };

    Game_BattlerBase.prototype.isCombinationSkill = function() {
        return this.combinationLeader() || this.combinationLeaderSkill();
    };

    Game_BattlerBase.prototype.clearCombinationSetup = function() {
        this._combinationLeader = null;
        this._combinationLeaderSkill = null;
    };

    Game_BattlerBase.prototype.setCombinationLeader = function(skill) {
        this._combinationLeaderSkill = skill;
    };

    Game_BattlerBase.prototype.setCombinationMember = function(leader) {
        this._combinationLeader = leader;
    };

    Game_BattlerBase.prototype.setupCombinationBaltters = function() {
        this._actions.forEach(function(action) {
            if (action.isCombinationAction()) {
                action.setCooperationBattlers();
            }
        })
    };

    //============================================================================
    // Game_Battler
    //============================================================================

    VictorEngine.CooperationSkills.performActionStart = Game_Battler.prototype.performActionStart;
    Game_Battler.prototype.performActionStart = function(action) {
        if (this.uniteLeaderSkill()) {
            this.clearUniteAction();
        }
        if (this.fusionLeaderSkill()) {
            this.clearFusionAction();
        }
        if (this.combinationLeaderSkill()) {
            this.clearCombinationAction();
        }
        VictorEngine.CooperationSkills.performActionStart.call(this, action);
    };

    VictorEngine.CooperationSkills.onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function() {
        VictorEngine.CooperationSkills.onAllActionsEnd.call(this);
        if (this.uniteLeaderSkill()) {
            if (Imported['VE - Active Time Battle']) {
                this.resetAtbUnion();
            }
            this.resetUniteAction(true);
        }
        if (this.fusionLeaderSkill()) {
            this.resetFusionAction(true);
        }
        if (this.combinationLeaderSkill()) {
            this.resetCombinationAction(true);
        }
    };

    VictorEngine.CooperationSkills.speed = Game_Battler.prototype.speed;
    Game_Battler.prototype.speed = function() {
        var battlers = this.allCooperationBattlers()
        if (this.uniteLeaderSkill() || this.fusionLeaderSkill() && battlers.length > 0) {
            return this.cooperationActionSpeed(battlers);
        } else if (this.uniteLeader() || this.fusionLeader()) {
            return -9999;
        } else {
            return VictorEngine.CooperationSkills.speed.call(this);
        }
    };

    Game_Battler.prototype.cooperationActionSpeed = function(battlers) {
        return Math.min.apply(null, battlers.map(function(member) {
            return VictorEngine.CooperationSkills.speed.call(member);
        })) || 0;
    };

    Game_Battler.prototype.allCooperationBattlers = function() {
        var battlers = []
        this._actions.forEach(function(action) {
            if (action.isCooperation()) {
                battlers = battlers.concat(action.cooperationBattlers());
            }
        })
        return battlers;
    };

    Game_Battler.prototype.resetUniteAction = function(turnEnd) {
        var leader = this;
        this.clearUniteSetup();
        $gameParty.members().forEach(function(member) {
            if (member.uniteLeader() === leader) {
                member.makeActions();
                member.clearUniteSetup();
            }
        })
    };

    Game_Battler.prototype.resetFusionAction = function(turnEnd) {
        var leader = this;
        this.clearFusionSetup();
        BattleManager.allBattleMembers().forEach(function(member) {
            if (member.fusionLeader() === leader) {
                member.makeActions();
                member.clearFusionSetup();
            }
        })
    };

    Game_Battler.prototype.resetCombinationAction = function(turnEnd) {
        var leader = this;
        this.clearCombinationSetup();
        BattleManager.allBattleMembers().forEach(function(member) {
            if (member.combinationLeader() === leader) {
                member.makeActions();
                member.clearCombinationSetup();
            }
        })
    };

    Game_Battler.prototype.clearUniteAction = function() {
        var leader = this;
        BattleManager.allBattleMembers().forEach(function(member) {
            if (member.uniteLeader() === leader) {
                member.clearActions();
                member.setActionState('acting');
            }
        })
    };

    Game_Battler.prototype.clearFusionAction = function() {
        var leader = this;
        BattleManager.allBattleMembers().forEach(function(member) {
            if (member.fusionLeader() === leader) {
                member.clearActions();
                member.setActionState('acting');
            }
        })
    };

    Game_Battler.prototype.clearCombinationAction = function() {
        var leader = this;
        BattleManager.allBattleMembers().forEach(function(member) {
            if (member.combinationLeader() === leader) {
                member.clearActions();
                member.setActionState('acting');
            }
        })
    };

    VictorEngine.CooperationSkills.onBattleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function() {
        VictorEngine.CooperationSkills.onBattleStart.call(this);
        this.clearUniteSetup();
        this.clearFusionSetup();
        this.clearCombinationSetup();
    };

    VictorEngine.CooperationSkills.onTurnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function() {
        VictorEngine.CooperationSkills.onTurnEnd.call(this);
        this.clearUniteSetup();
        this.clearFusionSetup();
    };

    VictorEngine.CooperationSkills.onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function() {
        VictorEngine.CooperationSkills.onBattleEnd.call(this);
        this.clearUniteSetup();
        this.clearFusionSetup();
        this.clearCombinationSetup();
    };

    Game_Battler.prototype.resetAtbUnion = function() {
        var leader = this;
        $gameParty.members().forEach(function(member) {
            if (member.uniteLeader() === leader) {
                member.clearAtb();
            }
        })
    };

    //============================================================================
    // Scene_Battle
    //============================================================================

    VictorEngine.CooperationSkills.onSelectAction = Scene_Battle.prototype.onSelectAction;
    Scene_Battle.prototype.onSelectAction = function() {
        var action = BattleManager.inputtingAction();
        VictorEngine.CooperationSkills.onSelectAction.call(this);
        if (!action.needsSelection()) {
            this.setUniteSkill();
        }
    };

    VictorEngine.CooperationSkills.onActorOk = Scene_Battle.prototype.onActorOk;
    Scene_Battle.prototype.onActorOk = function() {
        this.setUniteSkill();
        VictorEngine.CooperationSkills.onActorOk.call(this);
    };

    VictorEngine.CooperationSkills.onEnemyOk = Scene_Battle.prototype.onEnemyOk;
    Scene_Battle.prototype.onEnemyOk = function() {
        this.setUniteSkill();
        VictorEngine.CooperationSkills.onEnemyOk.call(this);
    };

    VictorEngine.CooperationSkills.startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
    Scene_Battle.prototype.startActorCommandSelection = function() {
        var actor = BattleManager.actor();
        actor.resetUniteAction();
        VictorEngine.CooperationSkills.startActorCommandSelection.call(this);
    };

    Scene_Battle.prototype.setUniteSkill = function() {
        var actor = BattleManager.actor();
        if (actor && this._actorCommandWindow.currentSymbol() === 'skill') {
            var skill = this._skillWindow.item();
            if (skill.cooperationSkill.unite) {
                this.setUniteLeader(skill);
            } else {
                actor.setUsingNonUnite();
            }
        } else {
            if (actor) {
                actor.setUsingNonUnite();
            }
        }
    };

    Scene_Battle.prototype.setUniteLeader = function(skill) {
        var leader = BattleManager.actor();
        var current = BattleManager.inputtingAction();
        return skill.cooperationSkill.unite.forEach(function(id) {
            var actor = $gameActors.actor(id);
            if (actor === leader) {
                actor.setUniteLeaderSkill(skill);
            } else {
                var action = new Game_Action(actor);
                action.setSkill(skill.id);
                action.setTarget(current._targetIndex);
                actor._actions.push(action);
                actor.setUniteLeader(leader);
            }
        });
    };

    //============================================================================
    // Window_BattleLog
    //============================================================================

    VictorEngine.CooperationSkills.startActionWindowBattleLog = Window_BattleLog.prototype.startAction;
    Window_BattleLog.prototype.startAction = function(subject, action, targets) {
        this._cooperationSkill = action;
        VictorEngine.CooperationSkills.startActionWindowBattleLog.call(this, subject, action, targets);
    };

    VictorEngine.CooperationSkills.performActionStartWindowBattleLog = Window_BattleLog.prototype.performActionStart;
    Window_BattleLog.prototype.performActionStart = function(subject, action) {
        VictorEngine.CooperationSkills.performActionStartWindowBattleLog.call(this, subject, action);
        if (this.isCooperationSkill(subject)) {
            this.performActionStartCooperation(subject, action);
        }
    };

    VictorEngine.CooperationSkills.performAction = Window_BattleLog.prototype.performAction;
    Window_BattleLog.prototype.performAction = function(subject, action, targets) {
        VictorEngine.CooperationSkills.performAction.call(this, subject, action, targets);
        if (this.isCooperationSkill(subject)) {
            this.performActionCooperation(subject, action, targets);
        }
    };

    VictorEngine.CooperationSkills.performActionEnd = Window_BattleLog.prototype.performActionEnd;
    Window_BattleLog.prototype.performActionEnd = function(subject, action) {
        VictorEngine.CooperationSkills.performActionEnd.call(this, subject, action);
        if (this.isCooperationSkill(subject)) {
            this.performActionEndCooperation(subject, this._cooperationSkill);
        }
    };

    VictorEngine.CooperationSkills.displayAction = Window_BattleLog.prototype.displayAction;
    Window_BattleLog.prototype.displayAction = function(subject, item) {
        if (DataManager.isSkill(item) && item.isCooperation) {
            var numMethods = this._methods.length;
            if (DataManager.isSkill(item)) {
                if (item.message1) {
                    this.push('addText', subject.cooperationName(item) + item.message1.format(item.name));
                }
                if (item.message2) {
                    this.push('addText', item.message2.format(item.name));
                }
            }
            if (this._methods.length === numMethods) {
                this.push('wait');
            }
        } else {
            VictorEngine.CooperationSkills.displayAction.call(this, subject, item);
        }
    };

    VictorEngine.CooperationSkills.performActionAnimation = Window_BattleLog.prototype.performActionAnimation;
    Window_BattleLog.prototype.performActionAnimation = function(subject, animationId) {
        VictorEngine.CooperationSkills.performActionAnimation.call(this, subject, animationId);
        if (this.isCooperationSkill(subject)) {
            this.performActionAnimationCooperation(subject, animationId, this._cooperationSkill);
        }
    };

    VictorEngine.CooperationSkills.performCastAnimation = Window_BattleLog.prototype.performCastAnimation;
    Window_BattleLog.prototype.performCastAnimation = function(subject, animationId) {
        VictorEngine.CooperationSkills.performCastAnimation.call(this, subject, animationId);
        if (this.isCooperationSkill(subject)) {
            this.performCastAnimationCooperation(subject, animationId, this._cooperationSkill);
        }
    };

    Window_BattleLog.prototype.isCooperationSkill = function(subject) {
        return (!Imported['VE - Battle Motions'] && this._cooperationSkill &&
            subject.isCooperationSkill(this._cooperationSkill.item()));
    };

    Window_BattleLog.prototype.performActionStartCooperation = function(subject, action) {
        var object = this;
        BattleManager.allBattleMembers().forEach(function(member) {
            if (member.cooperationLeader(action.item()) === subject) {
                VictorEngine.CooperationSkills.performActionStartWindowBattleLog.call(object, member, action);
            }
        })
    };

    Window_BattleLog.prototype.performActionCooperation = function(subject, action, targets) {
        var object = this;
        BattleManager.allBattleMembers().forEach(function(member) {
            if (member.cooperationLeader(action.item()) === subject) {
                VictorEngine.CooperationSkills.performAction.call(object, member, action, targets);
            }
        })
    };

    Window_BattleLog.prototype.performActionEndCooperation = function(subject, action) {
        var object = this;
        BattleManager.allBattleMembers().forEach(function(member) {
            if (member.cooperationLeader(action.item()) === subject) {
                VictorEngine.CooperationSkills.performActionEndWindowBattleLog.call(object, member, action);
            }
        })
    };

    Window_BattleLog.prototype.performActionAnimationCooperation = function(subject, animationId, action) {
        var object = this;
        BattleManager.allBattleMembers().forEach(function(member) {
            if (member.cooperationLeader(action.item()) === subject) {
                VictorEngine.CooperationSkills.performActionAnimation.call(object, member, animationId);
            }
        })
    };

    Window_BattleLog.prototype.performCastAnimationCooperation = function(subject, animationId, action) {
        var object = this;
        BattleManager.allBattleMembers().forEach(function(member) {
            if (member.cooperationLeader(action.item()) === subject) {
                VictorEngine.CooperationSkills.performCastAnimation.call(object, member, animationId);
            }
        })
    };

    VictorEngine.CooperationSkills.defaultMotionMovement = Window_BattleLog.prototype.defaultMotionMovement;
    Window_BattleLog.prototype.defaultMotionMovement = function(subject, action) {
        if (action.isCooperation()) {
            var motion = '';
            if (action && !action.isGuard()) {
                for (var i = 0; i < action.cooperationLength(); i++) {
                    if (action.isStepForward()) {
                        motion += 'motion: cooperation ' + String(i + 1) + ', walk;';
                        motion += 'move: cooperation ' + String(i + 1) + ', forward, 30, 48;';
                    } else {
                        motion += 'direction: cooperation ' + String(i + 1) + ', targets;';
                        motion += 'motion: cooperation ' + String(i + 1) + ', walk;';
                        motion += 'move: cooperation ' + String(i + 1) + ', close to target, 12, 80;';
                    }
                }
                for (var i = 0; i < action.cooperationLength(); i++) {
                    motion += 'wait: cooperation ' + String(i + 1) + ', move;';
                    motion += 'motion: cooperation ' + String(i + 1) + ', reset;';
                }
            }
            return motion;
        } else {
            return VictorEngine.CooperationSkills.defaultMotionMovement.call(this, subject, action);
        }
    };

    VictorEngine.CooperationSkills.defaultMotionExecute = Window_BattleLog.prototype.defaultMotionExecute;
    Window_BattleLog.prototype.defaultMotionExecute = function(subject, action) {
        if (action.isCooperation()) {
            var motion = '';
            motion += 'wait: all cooperation, move;';
            for (var i = 0; i < action.cooperationLength(); i++) {
                motion += 'motion: cooperation ' + String(i + 1) + ', action;';
            }
            for (var i = 0; i < action.cooperationLength(); i++) {
                motion += 'wait: cooperation ' + String(i + 1) + ', 8;';
            }
            motion += 'action: all targets, effect;';
            motion += 'wait: all targets, action;';
            return motion;
        } else {
            return VictorEngine.CooperationSkills.defaultMotionExecute.call(this, subject, action);
        }
    };

    VictorEngine.CooperationSkills.defaultMotionReturn = Window_BattleLog.prototype.defaultMotionReturn;
    Window_BattleLog.prototype.defaultMotionReturn = function(subject, action) {
        if (action.isCooperation()) {
            var motion = '';
            for (var i = 0; i < action.cooperationLength(); i++) {
                motion += 'motion: cooperation ' + String(i + 1) + ', return;';
                motion += 'move: cooperation ' + String(i + 1) + ', to home, 12;';
            }
            for (var i = 0; i < action.cooperationLength(); i++) {
                motion += 'wait: cooperation ' + String(i + 1) + ', move;';
                motion += 'motion: cooperation ' + String(i + 1) + ', reset;';
            }
            motion += 'wait: all cooperation, move;';
            return motion;
        } else {
            return VictorEngine.CooperationSkills.defaultMotionReturn.call(this, subject, action);
        }
    };

    VictorEngine.CooperationSkills.getMotionSubjects = Window_BattleLog.prototype.getMotionSubjects;
    Window_BattleLog.prototype.getMotionSubjects = function(type, user, targets, target, index) {
        if (this.isCooperation()) {
            type = type.toLowerCase().trim();
            var battlers = this._currentAction.action.cooperationBattlers();
            if (type === 'all cooperation') {
                return battlers;
            }
            var match = (/cooperation[ ]*(\d+)/gi).exec(type);
            if (match) {
                var battler = battlers[Number(match[1]) - 1]
                return battler ? [battler] : [];
            }
        }
        return VictorEngine.CooperationSkills.getMotionSubjects.call(this, type, user, targets, target, index);
    }

    Window_BattleLog.prototype.isCooperation = function() {
        return this._currentAction && this._currentAction.action && this._currentAction.action.isCooperation();
    }

})();