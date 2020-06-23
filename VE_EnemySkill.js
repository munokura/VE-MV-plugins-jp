/*
 * ==============================================================================
 * ** Victor Engine MV - Enemy Skills
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.01.24 > First release.
 *  v 1.01 - 2016.02.10 > Compatibility with Materia System.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Enemy Skills'] = '1.01';

var VictorEngine = VictorEngine || {};
VictorEngine.EnemySkills = VictorEngine.EnemySkills || {};

(function () {

	VictorEngine.EnemySkills.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.EnemySkills.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Enemy Skills', 'VE - Basic Module', '1.09');
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Enemy Skills', 'VE - Materia System');
	};

	VictorEngine.EnemySkills.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.EnemySkills.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.01 - Learn used by enemies.
 * @author Victor Sant
 *
 * @param Learn Skill Once
 * @desc Once a skill is learned by an actor, no other actor can 
 * learn the same skill.	true - ON	false - OFF
 * @default false
 *
 * @param Learn Skill Message
 * @desc Message displayed when learning a skill
 * %1 = actor name 	%2 = skill name
 * @default %1 learned the skill %2.
 *
 * @param Learn Message Wait
 * @desc Wait time that the learn message is displayed
 * Default: 24
 * @default 24
 *
 * @help 
 * ------------------------------------------------------------------------------
 * Actors, Classes, Weapons, Armors and States Notetags:
 * ------------------------------------------------------------------------------
 *  
 *  <learn enemy skill>
 *   type: X
 *   animation: X
 *   A : X%
 *   B : Y%
 *   C : Z%
 *  </learn enemy skill>
 *   This tag adds allows the actor to learn skill from enemies
 *   This setting is divided on 3 parts:
 *   type, animation, skills
 *
 * ---------------
 *
 *   - Type
 *   The way that the actor will learn the skill, one either values:
 *     hit     : learn the skill when is hit with it.
 *     observe : learn the skill when see the enemy using it.
 *
 * ---------------
 *
 *   - Animation
 *   Animation displayed when learn a new skill. The value is the Id of
 *   the animation. This setting is opitional
 *
 * ---------------
 *
 *   - Skills
 *   List of skills that can be learned, followed by the change of learning,
 *   each fo them you can add how many skills you want. The skill setup must
 *   use the following format:
 *     Id : Rate%
 *      Ex.: 10 : 100%
 *           15 : 50%
 *           25 : 70%
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <learn enemy skill>
 *   type: hit
 *   8 : 100%
 *   9 : 75%
 *   10 : 75%
 *   11 : 70%
 *  </learn enemy skill>
 *
 * ---------------
 *
 *  <learn enemy skill>
 *   type: observe
 *   animation: 52
 *   12 : 50%
 *   13 : 55%
 *   14 : 55%
 *   15 : 60%
 *   16 : 75%
 *   17 : 40%
 *  </learn enemy skill>
 *
 * ------------------------------------------------------------------------------
 * Compatibility:
 * ------------------------------------------------------------------------------
 *
 * - When used together with the plugin 'VE - Materia System', place this
 *   plugin above it.
 *
 */
/*:ja
 * @plugindesc v1.01 敵からスキルを習得するラーニングシステム
 * @author Victor Sant
 *
 * @param Learn Skill Once
 * @text スキル習得を単独化
 * @type boolean
 * @on 不可能
 * @off 可能
 * @desc あるアクターが習得したスキルを他のアクターは習得不可能
 * 不可能:true / 可能:false
 * @default false
 *
 * @param Learn Skill Message
 * @text スキル習得メッセージ
 * @desc スキル習得時に表示されるメッセージ
 * アクター名:%1 / スキル名:%2
 * @default %1は%2を習得した！
 *
 * @param Learn Message Wait
 * @text 習得メッセージ待ち時間
 * @desc 習得メッセージが表示されるまでの待ち時間
 * デフォルト: 24
 * @default 24
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/enemy-skills/
 *
 * ===========================================================================
 * 必要プラグイン
 * ===========================================================================
 *
 * このプラグインを使用するには、下記のプラグインが必要です。
 * - VE_BasicModule
 *
 * ---------------------------------------------------------------------------
 * アクター、職業、武器、防具、ステートのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <learn enemy skill>
 *   type: X
 *   animation: X
 *   A : X%
 *   B : Y%
 *   C : Z%
 *  </learn enemy skill>
 *   タグを追加すると、敵からスキルを習得できます。
 *   設定は3つのパートに分かれています。
 *   type, animation, skills
 *
 * ---------------
 *
 *   - Type
 *   アクターがスキルを習得する方法は、下記のどちらかになります。
 *     hit     : 攻撃を受けた時、スキルを習得します。
 *     observe : 敵が使用したのを見て、スキルを習得します。
 *
 * ---------------
 *
 *   - Animation
 *   新しいスキルを習得した時、表示されるアニメーション。
 *   値はアニメーションのIDです。
 *   この設定は任意です。
 *
 * ---------------
 *
 *   - Skills
 *   習得できるスキルのリストは、習得の変更に続いて、それぞれのfoは、
 *   望むどのように多くのスキルを追加することができます。
 *   スキルの設定は以下の形式を使用する必要があります。
 *     スキルID : 習得率%
 *      例 : 10 : 100%
 *           15 : 50%
 *           25 : 70%
 *
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 *  <learn enemy skill>
 *   type: hit
 *   8 : 100%
 *   9 : 75%
 *   10 : 75%
 *   11 : 70%
 *  </learn enemy skill>
 *
 * ---------------
 *
 *  <learn enemy skill>
 *   type: observe
 *   animation: 52
 *   12 : 50%
 *   13 : 55%
 *   14 : 55%
 *   15 : 60%
 *   16 : 75%
 *   17 : 40%
 *  </learn enemy skill>
 *
 * ---------------------------------------------------------------------------
 * 互換性
 * ---------------------------------------------------------------------------
 *
 * - 'VE_MateriaSystem'プラグインと併用する場合、
 * それより上方に配置してください。
 *
 */

(function () {

	//=============================================================================
	// Parameters
	//=============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.EnemySkills = {};
		VictorEngine.Parameters.EnemySkills.LearnOnce = eval(parameters["Learn Skill Once"]);
		VictorEngine.Parameters.EnemySkills.LearnMessage = String(parameters["Learn Skill Message"]);
		VictorEngine.Parameters.EnemySkills.LearnWait = Number(parameters["Learn Message Wait"]);
	};

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.EnemySkills.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.EnemySkills.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'weapon', 'armor', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.EnemySkills.loadNotes(data);
	};

	VictorEngine.EnemySkills.loadNotes = function (data) {
		data.learnEnemySkill = data.learnEnemySkill || [];
		this.processNotes(data);
	};

	VictorEngine.EnemySkills.processNotes = function (data, type) {
		var match;
		var regex = VictorEngine.getNotesValues('learn enemy skill')
		while ((match = regex.exec(data.note)) !== null) { this.processValues(data, match) };
	};

	VictorEngine.EnemySkills.processValues = function (data, match) {
		result = {};
		var value;
		var regex1 = new RegExp('type:[ ]*(hit|observe)', 'gi');
		var regex2 = new RegExp('animation:[ ]*(\\d+)', 'gi');
		var regex3 = new RegExp('(\\d+)[ ]*:[ ]*(\\d+)', 'gi');
		while ((value = regex1.exec(match[1])) !== null) { result.type = value[1].toLowerCase() };
		while ((value = regex2.exec(match[1])) !== null) { result.anim = Number(value[1]) };
		while ((value = regex3.exec(match[1])) !== null) { result[value[1]] = Number(value[2]) / 100 };
		data.learnEnemySkill.push(result);
	};

	//=============================================================================
	// Game_System
	//=============================================================================

	VictorEngine.EnemySkills.initialize = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function () {
		VictorEngine.EnemySkills.initialize.call(this);
		this._learnedEnemySkill = {};
	};

	Game_System.prototype.learnedEnemySkill = function (skillId) {
		return this._learnedEnemySkill[skillId];
	};

	Game_System.prototype.learnEnemySkill = function (skillId) {
		if (VictorEngine.Parameters.EnemySkills.LearnOnce) {
			this._learnedEnemySkill[skillId] = true;
		}
	};

	//=============================================================================
	// Game_Action
	//=============================================================================

	VictorEngine.EnemySkills.applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
	Game_Action.prototype.applyItemUserEffect = function (target) {
		VictorEngine.EnemySkills.applyItemUserEffect.call(this, target);
		this.hitLearnEnemySkill(target);
	};

	Game_Action.prototype.hitLearnEnemySkill = function (target) {
		var subject = this.subject()
		var item = this.item();
		if (subject.isEnemy() && !target.isEnemy() && DataManager.isSkill(item)) {
			target.checkLearnEnemySkill(item.id, 'hit');
		}
	}

	//=============================================================================
	// Game_Battler
	//=============================================================================

	VictorEngine.EnemySkills.useItem = Game_Battler.prototype.useItem;
	Game_Battler.prototype.useItem = function (item) {
		VictorEngine.EnemySkills.useItem.call(this, item);
		this.observeLearnEnemySkill(item);
	};

	Game_Battler.prototype.observeLearnEnemySkill = function (item) {
		if (this.isEnemy() && DataManager.isSkill(item)) {
			$gameParty.movableMembers().forEach(function (member) {
				member.checkLearnEnemySkill(item.id, 'observe');
			}, this)
		}
	};

	//=============================================================================
	// Game_Actor
	//=============================================================================

	Game_Actor.prototype.checkLearnEnemySkill = function (skillId, type) {
		this.getLearnEnemySkills().forEach(function (learn) {
			if (learn[skillId] && learn.type === type && Math.random() < learn[skillId] &&
				!this.isLearnedSkill(skillId)) {
				this._learnEnemySkill = { id: skillId, anim: learn.anim };
			}
		}, this)
	};

	Game_Actor.prototype.learnEnemySkill = function () {
		return this._learnEnemySkill;
	};

	Game_Actor.prototype.clearLeanSkill = function () {
		return this._learnEnemySkill = null;
	};

	Game_Actor.prototype.processLearnEnemySkill = function (skillId) {
		this.learnSkill(skillId);
		$gameSystem.learnEnemySkill(skillId);
	};

	Game_Actor.prototype.getLearnEnemySkills = function () {
		return this.traitObjects().reduce(function (r, data) {
			return r.concat(data.learnEnemySkill);
		}, []);
	};

	//=============================================================================
	// Window_BattleLog
	//=============================================================================

	VictorEngine.EnemySkills.endAction = Window_BattleLog.prototype.endAction;
	Window_BattleLog.prototype.endAction = function (subject) {
		this.learnEnemySkill();
		VictorEngine.EnemySkills.endAction.call(this, subject)
	};

	Window_BattleLog.prototype.learnEnemySkill = function () {
		$gameParty.battleMembers().forEach(function (member) {
			this.processLearnEnemySkill(member);
		}, this)
	};

	Window_BattleLog.prototype.processLearnEnemySkill = function (member) {
		var learn = member.learnEnemySkill();
		if (learn && member.isAlive() && !$gameSystem.learnedEnemySkill(learn.id)) {
			member.processLearnEnemySkill(learn.id)
			var name = member.name();
			var skill = $dataSkills[learn.id].name;
			var fmt = VictorEngine.Parameters.EnemySkills.LearnMessage.format(name, skill)
			if (learn.anim) this.displayLearnAnimation(member, learn.anim);
			if (fmt !== '') this.displayLearnMessage(fmt);
		}
		member.clearLeanSkill();
	};

	Window_BattleLog.prototype.displayLearnAnimation = function (member, animationId) {
		this.push('showAnimation', member, [member], animationId);
		this.push('waitForBattleAnimation', animationId);
	};

	Window_BattleLog.prototype.displayLearnMessage = function (fmt) {
		this.push('addText', fmt);
		this.push('waitForTime', VictorEngine.Parameters.EnemySkills.LearnWait);
	};

})();


