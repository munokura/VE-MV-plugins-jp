/*
 * ==============================================================================
 * ** Victor Engine MV - FollowUp Skills
 * ------------------------------------------------------------------------------
 *  VE_FollowUpSkills.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - FollowUp Skills'] = '1.03';

var VictorEngine = VictorEngine || {};
VictorEngine.FollowUpSkills = VictorEngine.FollowUpSkills || {};

(function () {

    VictorEngine.FollowUpSkills.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        VictorEngine.FollowUpSkills.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - FollowUp Skills', 'VE - Basic Module', '1.21');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - FollowUp Skills', 'VE - Dual Wield');
    };

    VictorEngine.FollowUpSkills.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function (name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.FollowUpSkills.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * @plugindesc v1.03 - Use another skill right after using a skill on battle.
 * @author Victor Sant
 *
 * @param Show FollowUp Name
 * @desc Display followUp skill use message.
 * true - ON      false - OFF
 * @default false
 *
 * @param Show FollowUp Motion
 * @desc Display the action motion when using the followUp skill.
 * true - ON      false - OFF
 * @default false
 *
 * @help 
 * ==============================================================================
 *  Notetags:
 * ==============================================================================
 *
 * ==============================================================================
 *  Followup Skill (for Actors, Classes, Enemies, Weapons, Armors and States)
 * ------------------------------------------------------------------------------
 *  <followup skill: trigger, X, Y%[, priority]>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Use another skill right after using a skill.
 *    trigger : action that will trigger the followUp skill. (see bellow)
 *    X : id of the skill used.
 *    Y : change of triggering.
 *    priority : priority of this followup skill. Numeric. Opitional.
 * ==============================================================================
 *
 * ==============================================================================
 *  Custom ollowup Skill (for Actors, Classes, Enemies, Weapons, Armors, States)
 * ------------------------------------------------------------------------------
 *  <custom followup skill: trigger[, priority]>
 *   result = code
 *  </custom followUp skill>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *  Use another skill right after using a skill.
 *    trigger : action that will trigger the followUp skill. (see bellow)
 *    code : code that will return the id of the skill used.
 *    priority : priority of this followup skill. Numeric. Opitional.
 * ==============================================================================
 *
 * ==============================================================================
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  The code uses the same values as the damage formula, so you can use "a" for
 *  the user, "v[x]" for variable and "item" for the item object. The 'result'
 *  must return a numeric value.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Trigger
 *  The trigger for the followUp action can be one of the following values: 
 *      skill x   : FollowUp when using the skill Id X.
 *      item x    : FollowUp when using the item Id X.
 *      stype x   : FollowUp when using skills with skill type Id X.
 *      itype x   : FollowUp when using items with item type Id X.
 *      element x : FollowUp when using actions with element Id X.
 *      attack    ; FollowUp when using basic attack.
 *      guard     : FollowUp when using guard skill.
 *      physical  : FollowUp when using physical skills.
 *      magical   : FollowUp when using magical skills.
 *      any       : FollowUp when using any action.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Priority
 *  The priority is an arbitrary numeric value used to decide wich action will
 *  be used if multiples followup tags exist. The skill with highest priority
 *  will be choosen. If there are different skills with the same priority, then
 *  the skill with lowest Id will be used.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Targets
 *  If the original action targets all, the new action will also target all.
 *  If the original action targets single, and the new action targets all, the
 *  action will target all.
 *
 *  If the original action scope is to target opponents, but the new action scope
 *  is to target allies, the action will always target the user.
 *  If the original action scope is to target allies, but the new action scope
 *  is to target opponents, the action will always target first opponent.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  - Battle Motions
 *  While using the plugin 'Battle Motions', the Plugin Parameter 
 *  'Show FollowUp Motion' will have no effect. No matter it's value, it will
 *  always display the followup action motion. If you wish to not show any motion
 *  you will need to use the Battle Motions notetags to change the action motion.
 *
 * ==============================================================================
 *
 * ==============================================================================
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <followup skill: attack, 9, 100%>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  <followup skill: skill 10, 75%, 5>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  <custom followup skill: magical>
 *   if (v[10] < 100) {
 *       result = 10;
 *   } else {
 *       result = 0;
 *   }
 *  </custom followup skill>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 *
 *  <custom followup skill: guard, 10>
 *   if (a.level < 10) {
 *       result = 11;
 *   } else {
 *       result = 12;
 *   }
 *  </custom followup skill>
 *
 * ==============================================================================
 * Compatibility:
 * ------------------------------------------------------------------------------
 * To be used together with this plugin, the following plugin must be placed
 * bellow this plugin:
 *    VE - Dual Wield
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.03.12 > First release.
 *  v 1.01 - 2016.03.15 > Changed behavior when actions have different scope.
 *                      > Added more followup triggers.
 *  v 1.02 - 2016.03.18 > Compatibility with Dual Wield.
 *  v 1.03 - 2016.05.31 > Compatibility with Battle Motions.
 * ==============================================================================
 */
/*:ja
 * @plugindesc v1.03 戦闘でスキルを使用した直後に別のスキルを使用できます
 * @author Victor Sant
 *
 * @param Show FollowUp Name
 * @text フォローアップメッセージ表示
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc フォローアップスキル使用メッセージを表示
 * 表示:true / 非表示:false
 * @default false
 *
 * @param Show FollowUp Motion
 * @text フォローアップモーション表示
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc フォローアップスキル使用時のアクションモーションを表示
 * 表示:true / 非表示:false
 * @default false
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/followup-skills/
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
 *  フォローアップスキル(アクター、職業、敵、武器、防具、ステート)
 * ---------------------------------------------------------------------------
 *  <followup skill: trigger, X, Y%[, priority]>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  スキルを使用した直後に別のスキルを使用します。
 *    trigger : アクションでフォローアップスキルを発動させます。 (後述)
 *    X : 使用スキルID
 *    Y : 変化トリガー
 *    priority : フォローアップスキルの優先度。数値。任意項目。
 * ===========================================================================
 *
 * ===========================================================================
 *  カスタムフォローアップスキル(アクター、職業、敵、武器、防具、ステート)
 * ---------------------------------------------------------------------------
 *  <custom followup skill: trigger[, priority]>
 *   result = code
 *  </custom followUp skill>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * スキルを使用した直後に別のスキルを使用します。
 *    trigger : アクションでフォローアップスキルを発動させます。 (後述)
 *    code : 使用スキルIDを返すコード
 *    priority : フォローアップスキルの優先度。数値。任意項目。
 * ===========================================================================
 *
 * ===========================================================================
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 * コードではダメージ式と同じ値を使用しているので、使用者には'a'、
 * 変数には'v[x]'、アイテムオブジェクトには'item'を使用します。
 * 'result'は数値を返す必要があります。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Trigger
 *  フォローアップアクションのトリガーは、以下の値のいずれかになります。
 *      skill x   : スキルIDx使用時にフォロー
 *      item x    : アイテムIDx使用時にフォロー
 *      stype x   : スキルタイプIDx使用時にフォロー
 *      itype x   : アイテムタイプIDx使用時にフォロー
 *      element x : 属性IDxのアクション使用時にフォロー
 *      attack    : 通常攻撃を使用時にフォロー
 *      guard     : 防御使用時にフォロー
 *      physical  : 物理スキル使用時にフォロー
 *      magical   : 魔法スキル使用時にフォロー
 *      any       : 全アクション使用時にフォロー
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Priority
 * 優先度は任意の数値で、複数のフォローアップタグが存在する場合、
 * どのアクションを使用するかを決定するために使用されます。
 * 優先度の高いスキルが選択されます。同じ優先度のスキルが複数存在する場合、
 * IDが最も低いスキルが使用されます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Targets
 * 元のアクションが全てを対象にしている場合、
 * 新しいアクションも全てを対象にします。
 * 元のアクションが単一を対象とし、新しいアクションが全てを対象とする場合、
 * アクションは全てを対象とします。
 *
 * 元のアクション範囲が対戦相手を対象にしているが、
 * 新しいアクション範囲が味方を対象にしている場合、
 * アクションは常に使用者を対象にします。
 * 元のアクション範囲が味方を対象とし、
 * 新しいアクション範囲が対戦相手を対象としている場合、
 * アクションは常に最初の対戦相手を対象とします。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Battle Motions
 * 'VE_BattleMotions'プラグインを使用している場合、
 * プラグインパラメータ'Show Follow Up Motion'は何の効果もありません。
 * 値に関係なく、常にフォローアップアクションのモーションが表示されます。
 * モーションを表示しないようにしたい場合、
 * VE_BattleMotionsのメモタグを使って
 * アクションモーションを変更する必要があります。
 *
 * ===========================================================================
 *
 * ===========================================================================
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 *  <followup skill: attack, 9, 100%>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  <followup skill: skill 10, 75%, 5>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  <custom followup skill: magical>
 *   if (v[10] < 100) {
 *       result = 10;
 *   } else {
 *       result = 0;
 *   }
 *  </custom followup skill>
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  <custom followup skill: guard, 10>
 *   if (a.level < 10) {
 *       result = 11;
 *   } else {
 *       result = 12;
 *   }
 *  </custom followup skill>
 *
 * ===========================================================================
 * 互換性
 * ---------------------------------------------------------------------------
 * 本プラグインと併用する場合、以下のプラグインは、
 * このプラグインの下に配置する必要があります。
 *    VE - Dual Wield
 * ===========================================================================
 *
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2016.03.12 > First release.
 *  v 1.01 - 2016.03.15 > Changed behavior when actions have different scope.
 *                      > Added more followup triggers.
 *  v 1.02 - 2016.03.18 > Compatibility with Dual Wield.
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
        VictorEngine.Parameters.FollowUpSkills = {};
        VictorEngine.Parameters.FollowUpSkills.ShowFollowUpName = eval(parameters["Show FollowUp Name"]);
        VictorEngine.Parameters.FollowUpSkills.FollowUpMotion = eval(parameters["Show FollowUp Motion"])
    }

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.FollowUpSkills.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function (data, index) {
        VictorEngine.FollowUpSkills.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['actor', 'class', 'weapon', 'armor', 'enemy', 'state'])) {
            VictorEngine.FollowUpSkills.loadNotes(data);
        }
    };

    VictorEngine.FollowUpSkills.loadNotes = function (data) {
        data.followUpSkills = data.followUpSkills || [];
        this.processNotes(data);
    };

    VictorEngine.FollowUpSkills.processNotes = function (data, type) {
        var match;
        var part1 = 'followup skill'
        var part2 = '[ ]*:[ ]*(physical|magical|attack|guard|item|skill)[ ]*(\\d+)?'
        var part3 = '[ ]*(:?[ ]*,[ ]*(\\d+))?[ ]*'
        var regex1 = new RegExp('<' + part1 + part2 + ',[ ]*(?:skill)?[ ]*(\\d+)[ ]*,[ ]*(\\d+)\\%?' + part3 + '>', 'gi');
        var regex2 = VictorEngine.getNotesValues('custom ' + part1 + part2 + part3, 'custom ' + part1);
        while (match = regex1.exec(data.note)) {
            this.processValues(data, match, false);
        };
        while (match = regex2.exec(data.note)) {
            this.processValues(data, match, true);
        };
    };

    VictorEngine.FollowUpSkills.processValues = function (data, match, code) {
        var result = {};
        result.type = match[1].toLowerCase();
        result.id = Number(match[2]) || 0;
        result.skill = code ? 0 : Number(match[3]);
        result.rate = code ? 0 : Number(match[4]);
        result.code = code ? match[4].trim() : '';
        result.priority = Number(match[code ? 3 : 5]) || 0;
        data.followUpSkills.push(result);
    };

    //=============================================================================
    // BattleManager
    //=============================================================================

    VictorEngine.FollowUpSkills.initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function () {
        VictorEngine.FollowUpSkills.initMembers.call(this);
        this._followUpTargets = [];
    };

    VictorEngine.FollowUpSkills.startAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        VictorEngine.FollowUpSkills.startAction.call(this);
        this.setFollowUp();
    };

    VictorEngine.FollowUpSkills.endAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        if (this._canFollowUp) {
            this.startFollowUpAction();
        } else {
            this._isFollowUp = false;
            this._canFollowUp = false;
            VictorEngine.FollowUpSkills.endAction.call(this);
        }
    };

    BattleManager.setFollowUp = function () {
        if (!this._canFollowUp) {
            this._followUpTargets = this._targets.clone();
            this._followUpSkillId = this.followUpActionSkillId();
            this._canFollowUp = this.canFollowUp();
        }
    };

    BattleManager.startFollowUpAction = function () {
        var action = new Game_Action(this._action.subject());
        var skillId = this._followUpSkillId;
        action.prepareFollowUp(skillId, this._followUpTargets);
        this._subject.addNewAction(action);
        this._followUpTargets = [];
        this._isFollowUp = true;
        this._canFollowUp = false;
        this._phase = 'turn';
    };

    BattleManager.canFollowUp = function () {
        var subject = this._action.subject();
        var canUse = subject.canUse($dataSkills[this._followUpSkillId])
        var targets = this._followUpTargets.filter(function (target) {
            return target.isAlive();
        });
        return !this._isFollowUp && canUse && targets.length > 0;
    };

    BattleManager.followUpActionSkillId = function () {
        return this._action.subject().followUpSkill(this._action);
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    VictorEngine.FollowUpSkills.makeTargets = Game_Action.prototype.makeTargets;
    Game_Action.prototype.makeTargets = function () {
        if (this._followUpTargets) {
            return this._followUpTargets;
        } else {
            return VictorEngine.FollowUpSkills.makeTargets.call(this)
        }
    };

    Game_Action.prototype.prepareFollowUp = function (id, targets) {
        this.setSkill(id);
        var result = [];
        if (this.isForUser() || (this.isForFriend() && this.isForOne())) {
            result = [this.subject()];
        } else if (this.isForFriend() && this.isForAll() && !this.isForDeadFriend()) {
            result = this.subject().friendsUnit().aliveMembers();
        } else if (this.isForFriend() && this.isForAll() && this.isForDeadFriend()) {
            result = this.subject().friendsUnit().deadCounterMembers();
        } else if (this.isForOpponent() && this.isForAll()) {
            result = this.subject().opponentsUnit().aliveMembers();
        } else if (this.isForOpponent()) {
            result = targets;
        };
        this._followUpTargets = this.repeatTargets(result);
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

    Game_Battler.prototype.followUpSkill = function (action) {
        var object = this;
        var result = this.traitObjects().reduce(function (r, data) {
            return r.concat(object.getFollowUpSkills(data.followUpSkills, action));
        }, []).sort(this.getfollowUpPriority.bind(this))[0];
        return this.followUpSkillAction(result, action);
    };

    Game_Battler.prototype.getfollowUpPriority = function (a, b) {
        if (a.priority === b.priority) {
            return a.id - b.id;
        } else {
            return b.priority - a.priority;
        }
    };

    Game_Battler.prototype.getFollowUpSkills = function (followUpSkills, action) {
        return followUpSkills.filter(function (data) {
            return this.followUpType(data, action) && this.followUpRate(data);
        }, this);
    };

    Game_Battler.prototype.followUpType = function (data, action) {
        return (data.type === 'stype' && action.isSkill() && action.item().stypeId === data.id) ||
            (data.type === 'itype' && action.isItem() && action.item().itypeId === data.id) ||
            (data.type === 'skill' && action.isSkill() && action.item().id === data.id) ||
            (data.type === 'item' && action.isItem() && action.item().id === data.id) ||
            (data.type === 'element' && action.item().damage.elementId === data.id) ||
            (data.type === 'physical' && action.isPhysical()) ||
            (data.type === 'magical' && action.isMagical()) ||
            (data.type === 'attack' && action.isAttack()) ||
            (data.type === 'guard' && action.isGuard()) ||
            (data.type === 'any');
    };

    Game_Battler.prototype.followUpRate = function (data) {
        if (data.code) {
            return true;
        } else {
            return Math.random() < data.rate / 100
        }
    };

    Game_Battler.prototype.followUpSkillAction = function (data, action) {
        if (data && data.code) {
            var result = 0;
            var item = action.item();
            var a = this;
            var v = $gameVariables._data;
            eval(data.code)
            return result || 0;
        } else if (data && data.skill) {
            return data.skill || 0;
        } else {
            return 0;
        }
    };

    //=============================================================================
    // Window_BattleLog
    //=============================================================================

    Window_BattleLog.prototype.startFollowUpAction = function (subject, action, targets) {
        var item = action.item();
        this.push('wait');
        this._followUpAction = true;
        this.startAction(subject, action, targets);
        this._followUpAction = false;
        if (!VictorEngine.Parameters.FollowUpSkills.FollowUpMotion && !Imported['VE - Battle Motions']) {
            VictorEngine.removeMethod(this._methods, 'performAction')
        }
    };

    VictorEngine.FollowUpSkills.displayAction = Window_BattleLog.prototype.displayAction;
    Window_BattleLog.prototype.displayAction = function (subject, action, targets) {
        if (!this._followUpAction || VictorEngine.Parameters.FollowUpSkills.ShowFollowUpName) {
            if (this._followUpAction) {
                this.push('clear');
            }
            VictorEngine.FollowUpSkills.displayAction.call(this, subject, action, targets);
        } else {
            this.push('wait');
        }
    };

})();