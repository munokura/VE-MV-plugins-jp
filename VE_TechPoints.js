/*
 * ===========================================================================
 * ** Victor Engine MV - Tech Points
 * ---------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.01.23 > First release.
 *  v 1.01 - 2016.03.04 > Improved code for better handling script codes.
 *  v 1.02 - 2016.05.12 > Added escape codes for Tech Points Cost display.
 *  v 1.03 - 2016.05.14 > Fixed issue with MaxTechPoints Plugin Command.
 * ===========================================================================
 */

var Imported = Imported || {};
Imported['VE - Tech Points'] = '1.03';

var VictorEngine = VictorEngine || {};
VictorEngine.TechPoints = VictorEngine.TechPoints || {};

(function() {

	VictorEngine.TechPoints.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function() {
		VictorEngine.TechPoints.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Tech Points', 'VE - Basic Module', '1.20');
	};

	VictorEngine.TechPoints.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function(name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.TechPoints.requiredPlugin.call(this, name, required, version)
		};
	};
	
})();

/*:
 * @plugindesc v1.03 - Skills can be used a fixed number of times.
 * @author Victor Sant
 *
 * @param Tech Point Growth
 * @desc Tech point growth, a string that is evaluated like a damage
 * formula. (more details on the help)
 * @default 5 + a.level / 5
 *
 * @param Max Tech Points
 * @desc The max tech point a skill can have, regardless the growth.
 * @default 20
 *
 * @param Tech Point Format
 * @desc Format that the Tech points is drawn on the skill window.
 * %1 = current Tech Point 	%2 = max Tech Point (allows escape code)
 * @default %1/%2
 *
 * @help 
 * ---------------------------------------------------------------------------
 * Actors, Classes, Enemies, Weapons, Armors and States Notetags:
 * ---------------------------------------------------------------------------
 *   
 *  <infinite tech points>
 *    The battler will ignore tech point cost and will be able to use the skill
 *    freely (other costs such as MP and TP are still valid)
 *
 * ---------------
 *
 *  <tech points: skill, max>
 *   result = growth
 *  </tech points>
 *    Set a custom tech point growth and max value for the skill.
 *      skill  : id of the skill.
 *      max    : max tech point value. Can't be higher than the 'Max Tech Points'
 *      growth : growth value. Script code. (more details bellow)
 *
 * ---------------------------------------------------------------------------
 * Skills Notetags:
 * ---------------------------------------------------------------------------
 *   
 *  <tech skill>
 *    This tag defines a skill as a 'Tech Skill', wich will limit their uses based
 *    on the tech points available for that skill.
 *
 * ---------------
 *
 *  <tech points: max>
 *   result = growth
 *  </tech points>
 *    Set a custom tech point growth and max value for the skill.
 *      max    : max tech point value. Can't be higher than the 'Max Tech Points'
 *      growth : growth value. Script code. (more details bellow)
 *
 * ---------------
 *
 *  <no recover>
 *    The skill tech points will NOT be recovered when using the plugin command
 *    'RecoverAllTechPoints', using the event command 'Recover All' or items with
 *    the '<recover all tech points>' notetag. You can still recover points with
 *    items or skills with the tag '<change tech points: skill, value>' or with
 *    the plugin command 'ChangeTechPoints'.
 *
 * ---------------------------------------------------------------------------
 * Items Notetags:
 * ---------------------------------------------------------------------------
 *
 *  <max tech points: skill, value>
 *    Changes the max tech points that the skill have.
 *      skill : id of the skill.
 *      value : value changed. Can be negative.
 *
 * ---------------
 *
 *  <recover all tech points>
 *    Recover all tech points of the targets.
 *
 * ---------------------------------------------------------------------------
 * Skills and Items Notetags:
 * ---------------------------------------------------------------------------
 * 
 *  <change tech points: skill, value>
 *    Changes the current tech points available for a skill.
 *      skill : id of the skill.
 *      value : value changed. Can be negative.
 *
 * ---------------------------------------------------------------------------
 * Plugin Commands:
 * ---------------------------------------------------------------------------
 *
 *  You can use v[id] on the instead of a numeric value to get the value from 
 *  the variable with the id set. For example, v[3] will get the value from the
 *  variable id 3.
 *
 * ---------------
 *
 *  ChangeTechPoints actor id skill value
 *  ChangeTechPoints party id skill value
 *    Changes the current tech points of a skill.
 *      actor : the target will be decided by the actor Id.
 *      party : the target will be decided by the position in party.
 *      id    : actor id or the actor position in party.
 *      skill : id of the skill.
 *      value : value changed. Can be negative.
 *
 * ---------------
 *
 *  MaxTechPoints actor id skill value
 *  MaxTechPoints party id skill value
 *    Changes the max tech points of a skill.
 *      actor : the target will be decided by the actor Id.
 *      party : the target will be decided by the position in party.
 *      id    : actor id or the actor position in party.
 *      skill : id of the skill.
 *      value : value changed. Can be negative.
 *
 * ---------------
 *
 *  RecoverAllTechPoints
 *   Recover all tech points from the party memebers.
 *
 * ---------------------------------------------------------------------------
 * Additional Information:
 * ---------------------------------------------------------------------------
 * 
 *  - The tech point growth:
 *  The tech point growth is a formula that defines how many uses of a skill the
 *  battler have. It uses the same values as the damage formula, so you can use 
 *  "a" for the user and "v[x]" for variable. The 'result' must return a numeric
 *  value.
 *
 *  NOTE: Enemies by default don't have levels, so if you use levels on your
 *  growth formula, enemies will end without Tech Points. You can solve that
 *  by giving a different formula for the enemy tech skills.
 *
 *  If a battler have multiple values for the growth or the max value of tech
 *  points, the highest one will be used.
 * 
 * ---------------------------------------------------------------------------
 * Example Notetags:
 * ---------------------------------------------------------------------------
 *
 *  <tech points: 9, 20>
 *   result = 5 + a.level / 5
 *  </tech points>
 *
 * ---------------
 *
 *  <tech points: 25>
 *   result = 1 + a.mat / 100
 *  </tech points>
 *
 * ---------------------------------------------------------------------------
 */

/*:ja
 * @plugindesc v1.03 使用回数が限られているスキルを設定できます。
 * @author Victor Sant
 *
 * @param Tech Point Growth
 * @text テックポイント成長式
 * @desc テックポイントの成長式。ダメージ式のように評価される文字列(詳細はヘルプ)
 * @default 5 + a.level / 5
 *
 * @param Max Tech Points
 * @text 最大テックポイント
 * @desc 成長に関係なく、スキルの最大テックポイント
 * @default 20
 *
 * @param Tech Point Format
 * @text テックポイント表示形式
 * @desc テックポイントの表示形式。%1:現在のテックポイント / %2:最大テックポイント(制御文字を許可)
 * @default %1/%2
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/tech-points/
 * ===========================================================================
 * 必要プラグイン
 * ===========================================================================
 *
 * このプラグインを使用するには、下記のプラグインが必要です。
 * - VE_BasicModule
 *
 * ---------------------------------------------------------------------------
 * アクター、職業、敵、武器、防具、ステートのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <infinite tech points>
 *  バトラーはテックポイントのコストを無視し、
 *  スキルを自由に使用できます(MPやTPなどの他のコストは引き続き有効です)
 *
 * ---------------
 *
 *  <tech points: skill, max>
 *   result = growth
 *  </tech points>
 *  カスタムテックポイントの成長とスキルの最大値を設定します。
 *      skill  : スキルID
 *      max    : 最大テックポイント値。
 *               'Max Tech Points'より高くすることはできません
 *      growth : 成長式。スクリプトコード。 (詳細は以下)
 *
 * ---------------------------------------------------------------------------
 * スキルのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <tech skill>
 *  このタグはスキルを'テックスキル'として定義し、
 *  そのスキルで使用可能なテックポイントに基づいて使用を制限します。
 *
 * ---------------
 *
 *  <tech points: max>
 *   result = growth
 *  </tech points>
 *  カスタムテックポイントの成長とスキルの最大値を設定します。
 *      max    : 最大テックポイント値。
 *               'Max Tech Points'より高くすることはできません
 *      growth : 成長式。スクリプトコード。 (詳細は以下)
 *
 * ---------------
 *
 *  <no recover>
 *  プラグインコマンド'RecoverAllTechPoints'を使用し、
 *  イベントコマンド'全回復'/'<recover all tech points>'メモタグを使用すると、
 *  スキルテックポイントは回復されません。
 *  タグ'<change tech points: skill, value>'か
 *  プラグインコマンド'ChangeTechPoints'を使用した
 *  アイテム/スキルでポイントを回復できます。
 *
 * ---------------------------------------------------------------------------
 * アイテムのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <max tech points: skill, value>
 *    スキルの最大テックポイントを変更します。
 *      skill : スキルID
 *      value : 変更値。負の値も使用できます。
 *
 * ---------------
 *
 *  <recover all tech points>
 *    対象のテックポイントを全回復します。
 *
 * ---------------------------------------------------------------------------
 * スキル、アイテムのメモタグ
 * ---------------------------------------------------------------------------
 *
 *  <change tech points: skill, value>
 *    スキルに利用可能な現在のテックポイントを変更します。
 *      skill : スキルID
 *      value : 変更値。負の値も使用できます。
 *
 * ---------------------------------------------------------------------------
 * プラグインコマンド
 * ---------------------------------------------------------------------------
 *
 * idが設定された変数から値を取得するために、
 * 数値の代わりにv[id]を使用できます。
 * 例えば、v[3]は変数id3から値を取得します。
 *
 * ---------------
 *
 *  ChangeTechPoints actor id skill value
 *  ChangeTechPoints party id skill value
 *    スキルの現在のテックポイントを変更します。
 *      actor : 対象はアクターIDによって決定されます。
 *      party : 対象はパーティ内の位置によって決定されます。
 *      id    : アクターIDまたはパーティのアクター位置。
 *      skill : スキルID
 *      value : 変更値。負の値も使用できます。
 *
 * ---------------
 *
 *  MaxTechPoints actor id skill value
 *  MaxTechPoints party id skill value
 *    スキルの最大テックポイントを変更します。
 *      actor : 対象はアクターIDによって決定されます。
 *      party : 対象はパーティ内の位置によって決定されます。
 *      id    : アクターIDまたはパーティのアクター位置。
 *      skill : スキルID
 *      value : 変更値。負の値も使用できます。
 *
 * ---------------
 *
 *  RecoverAllTechPoints
 *   パーティーメンバーのテックポイントを全回復します。
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 *  - テックポイントの成長式:
 *  テックポイントの成長式は、戦闘のスキルの最大使用回数を定義する式です。
 *  ダメージの式と同じ値を使用し、使用者に'a'、変数に'v[x]'を使用できます。
 *  'result'は数値を返す必要があります。
 *
 *  注:デフォルトでは敵にはレベルがありません。
 *  成長式でレベルを使用すると、敵はテックポイントなしで終了します。
 *  敵のテックスキルに異なる式を設定することで、それを解決できます。
 *
 *  戦闘に複数の成長式/テックポイントの最大値がある場合、
 *  最も高いものが使用されます。
 *
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 *  <tech points: 9, 20>
 *   result = 5 + a.level / 5
 *  </tech points>
 *
 * ---------------
 *
 *  <tech points: 25>
 *   result = 1 + a.mat / 100
 *  </tech points>
 *
 * ---------------------------------------------------------------------------
 */

(function() {
	
	//=============================================================================
	// Parameters
	//=============================================================================
	
	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.TechPoints = {};
		VictorEngine.Parameters.TechPoints.TechPointGrowth = String(parameters["Tech Point Growth"]);
		VictorEngine.Parameters.TechPoints.TechPointFormat = String(parameters["Tech Point Format"]);
		VictorEngine.Parameters.TechPoints.MaxTechPoints   = Number(parameters["Max Tech Points"]) || 0;
	};
	
	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.TechPoints.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function(data, index) {
		VictorEngine.TechPoints.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'enemy', 'weapon', 'armor', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.TechPoints.loadNotes1(data);
		var list = ['item'];
		if (this.objectSelection(index, list)) VictorEngine.TechPoints.loadNotes2(data);
		var list = ['skill'];
		if (this.objectSelection(index, list)) VictorEngine.TechPoints.loadNotes3(data);
	};
	
	VictorEngine.TechPoints.loadNotes1 = function(data) {
		data.techSkills = data.techSkills || {};
		this.processNotes1(data);
	};
	
	VictorEngine.TechPoints.loadNotes2 = function(data) {
		data.techSkills = data.techSkills || {};
		this.processNotes2(data);
	};
	
	VictorEngine.TechPoints.loadNotes3 = function(data) {
		data.techSkills = data.techSkills || {};
		this.processNotes3(data);
	};
	
	VictorEngine.TechPoints.processNotes1 = function(data) {
		var match;
		var part1  = "[ ]*(\\d+)[ ]*,[ ]*(\\d+)[ ]*";
		var regex1 = new RegExp('<infinite tech points>', 'gi');
		var regex2 = VictorEngine.getNotesValues('tech points[ ]*:' + part1, 'tech points');
		while ((match = regex1.exec(data.note)) !== null) { data.techSkills.infinite = true };
		while ((match = regex2.exec(data.note)) !== null) { this.processValues1(data, match) };
	};
	
	VictorEngine.TechPoints.processNotes2 = function(data) {
		var match;
		var regex1 = new RegExp('<change tech points:[ ]*(\\d+)[ ]*,[ ]*([+-]?\\d+)[ ]*>', 'gi');
		var regex2 = new RegExp('<max tech points:[ ]*(\\d+)[ ]*,[ ]*([+-]?\\d+)[ ]*>', 'gi');
		var regex3 = new RegExp('<recover all tech points>', 'gi');
		while ((match = regex1.exec(data.note)) !== null) { this.processValues2(data, match) };
		while ((match = regex2.exec(data.note)) !== null) { this.processValues3(data, match) };
		while ((match = regex3.exec(data.note)) !== null) { data.techSkills.recover = true };
	};
	
	VictorEngine.TechPoints.processNotes3 = function(data) {
		var match;
		var part1  = "[ ]*('[^\']+'|\"[^\"]+\"),";
		var regex1 = new RegExp('<tech skill>', 'gi');
		var regex2 = new RegExp('<no recover>', 'gi');
		var regex3 = new RegExp('<change tech points:[ ]*(\\d+)[ ]*,[ ]*([+-]?\\d+)[ ]*>', 'gi');
		var regex4 = VictorEngine.getNotesValues('tech points:[ ]*(\\d+)[ ]*', 'tech points');
		while ((match = regex1.exec(data.note)) !== null) { data.techSkills.isTech = true };
		while ((match = regex2.exec(data.note)) !== null) { data.techSkills.noRecover = true };
		while ((match = regex3.exec(data.note)) !== null) { this.processValues2(data, match) };
		while ((match = regex4.exec(data.note)) !== null) { this.processValues4(data, match) };
	};
	
	VictorEngine.TechPoints.processValues1 = function(data, match) {
		var result = {}
		result.max     = Number(match[2]);
		result.growth  = String(match[3]).trim();
		data.techSkills[match[1]] = result;
	};
	
	VictorEngine.TechPoints.processValues2 = function(data, match) {
		data.techSkills.change = data.change || [];
		data.techSkills.change[Number(match[1])] = Number(match[2]);
	};
	
	VictorEngine.TechPoints.processValues3 = function(data, match) {
		data.techSkills.changeMax = data.changeMax || [];
		data.techSkills.changeMax[Number(match[1])] = Number(match[2]);
	};
	
	VictorEngine.TechPoints.processValues4 = function(data, match) {
		data.techSkills.max    = Number(match[1]);
		data.techSkills.growth = String(match[2]).trim();
	};
	
	//=============================================================================
	// Game_BattlerBase
	//=============================================================================
	
	VictorEngine.TechPoints.refresh = Game_BattlerBase.prototype.refresh;
	Game_BattlerBase.prototype.refresh = function() {
		VictorEngine.TechPoints.refresh.call(this);
		this.refreshTechPoints();
	};
	
	VictorEngine.TechPoints.canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
	Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
		return VictorEngine.TechPoints.canPaySkillCost.call(this, skill) && this.skillTechCost(skill);
	};
	
	VictorEngine.TechPoints.paySkillCost = Game_BattlerBase.prototype.paySkillCost;
	Game_BattlerBase.prototype.paySkillCost = function(skill) {
		VictorEngine.TechPoints.paySkillCost.call(this, skill);
		this.paySkillTechCost(skill);
	};
	
	VictorEngine.TechPoints.recoverAll = Game_BattlerBase.prototype.recoverAll;
	Game_BattlerBase.prototype.recoverAll = function() {
		VictorEngine.TechPoints.recoverAll.call(this)
		this.recoverAllTechPoints();
	};
	
	Game_BattlerBase.prototype.refreshTechPoints = function() {
		this.techPointSkills().forEach(function(skill) {
			this.refreshTechSkill(skill.id);
		}, this)
	};
	
	Game_BattlerBase.prototype.skillTechCost = function(skill) {
		if (this.infiniteTechPoints() || !skill.techSkills.isTech) return true;
		if (!this._techSkills[skill.id]) this.refreshTechSkill(skill.id);
		return this.techPoint(skill.id) > 0;
	};
		
	Game_BattlerBase.prototype.paySkillTechCost = function(skill) {
		 if (skill.techSkills.isTech && !this.infiniteTechPoints()) {
			 this.changeTechPoints(skill.id, -1);
		 }
	};
	
	Game_BattlerBase.prototype.changeTechPoints = function(skillId, value) {
		if (!this._techSkills[skillId]) this.refreshTechSkill(skillId);
		this._techSkills[skillId].now += value;
		this.refreshTechSkill(skillId);
	};
	
	Game_BattlerBase.prototype.changeMaxTech = function(skillId, value) {
		this._techPoints[skillId] = this._techPoints[skillId] || 0;
		this._techPoints[skillId] += value;
		this.refreshTechSkill(skillId);
	};
	
	Game_BattlerBase.prototype.refreshTechSkill = function(skillId) {
		this._techSkills[skillId] = this._techSkills[skillId] || {};
		this._techSkills[skillId].max = this.setupTechMax(skillId);
		var now = this._techSkills[skillId].now;
		var max = this._techSkills[skillId].max;
		var num = Math.max(Math.min(now, max), 0)
		this._techSkills[skillId].now = num ? num : num === 0 ? 0 : max;
	};
	
	Game_BattlerBase.prototype.setupTechMax = function(skillId) {
		var a   = this;
		var v   = $gameVariables._data;
		var get = this.getTechSkillsValues(skillId);
		var now = this.getTechSkillsValuesNow(get);
		var max = get.map(function(data) { return (data.max || 0) }, []);
		var limit = VictorEngine.Parameters.TechPoints.MaxTechPoints;
		now = now.concat(eval(VictorEngine.Parameters.TechPoints.TechPointGrowth));
		now = now.sort(function(a, b) { return b - a })[0];
		max = max.sort(function(a, b) { return b - a })[0];
		now = now + (this._techPoints[skillId] || 0);
		return Math.floor(now.clamp(0, Math.min(max, limit))) || 0;
	};
	
	Game_BattlerBase.prototype.getTechSkillsValues = function(skillId) {
		var objects = this.traitObjects().reduce(function(r, data) {
			var result = data.techSkills[skillId];
			return r.concat(result || []);
		}, []);
		var skill = $dataSkills[skillId].techSkills;
		return objects.concat(skill || []);
	};
	
	Game_BattlerBase.prototype.getTechSkillsValuesNow = function(get) {
		var object = this;
		return get.reduce(function(r, data) { 
			var result = 0;
			var v = $gameVariables._data;
			var a = object;
			eval(data.growth);
			return r.concat(result);
		}, []);
	};
		
	Game_BattlerBase.prototype.infiniteTechPoints = function() {
		return this.traitObjects().some(function(data) {
			return data.techSkills.infinite;
		}, []);
	};
	
	Game_BattlerBase.prototype.techPoint = function(skillId) {
		var result = this._techSkills[skillId];
		return result ? (result.now || 0) : 0 ;
	};
	
	Game_BattlerBase.prototype.techMax = function(skillId) {
		var result = this._techSkills[skillId];
		return result ? (result.max || 0) : 0 ;
	};
	
	Game_BattlerBase.prototype.recoverAllTechPoints = function() {
		this.techPointSkills().forEach(function(skill) {
			if (!skill.techSkills.noRecover) {
				this.refreshTechSkill(skill.id);
				this._techSkills[skill.id].now = this._techSkills[skill.id].max;
			}
		}, this)
	};

	//=============================================================================
	// Game_Actor
	//=============================================================================
	
	VictorEngine.TechPoints.setupActor = Game_Actor.prototype.setup;
	Game_Actor.prototype.setup = function(actorId) {
		this._techPoints = {};
		this._techSkills = {};
		VictorEngine.TechPoints.setupActor.call(this, actorId);
	};

	Game_Actor.prototype.techPointSkills = function() {
		return this.skills().filter(function(skill) {
            return skill.techSkills.isTech;
        }, this);
	};
		
	//=============================================================================
	// Game_Enemy
	//=============================================================================
	
	VictorEngine.TechPoints.setupEnemy = Game_Enemy.prototype.setup;
	Game_Enemy.prototype.setup = function(enemyId, x, y) {
		this._techPoints = {};
		this._techSkills = {};
		VictorEngine.TechPoints.setupEnemy.call(this, enemyId, x, y);
	};
	
	Game_Enemy.prototype.techPointSkills = function() {
		var skills = this.enemy().actions.reduce(function(r, action) {
            return r.concat($dataSkills[action.skillId]);
        }, []);
		return skills.filter(function(skill) { return skill.techSkills.isTech });
	};
	
	//=============================================================================
	// Game_Action
	//=============================================================================
	
	VictorEngine.TechPoints.applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
	Game_Action.prototype.applyItemUserEffect = function(target) {
		VictorEngine.TechPoints.applyItemUserEffect.call(this, target)
		this.applyItemTechPointEffect(target);
	};
	
	Game_Action.prototype.applyItemTechPointEffect = function(target) {
		if (this.item().techSkills.change) {
			this.item().techSkills.change.forEach(function(value, index) {
				if (value) target.changeTechPoints(index, value);
			});
		}
		if (this.item().techSkills.changeMax) {
			this.item().techSkills.changeMax.forEach(function(value, index) {
				if (value) target.changeTechPoints(index, value);
			});
		}
		if (this.item().techSkills.recover) target.recoverAllTechPoints();
	};
	
	//=============================================================================
	// Game_Interpreter
	//=============================================================================

	VictorEngine.TechPoints.pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		VictorEngine.TechPoints.pluginCommand.call(this, command, args);
		if (command.toLowerCase() === 'changetechpoints') {
			var v = $gameVariables._data;
			if (args[0].toLowerCase() === 'actor') {
				var skill = Number(eval(args[2]));
				var value = Number(eval(args[3]));
				var actor = $gameActors.actor(Number(eval(args[1])));
				if (actor) actor.changeTechPoints(skill, value);
			}
			if (args[0].toLowerCase() === 'party') {
				var skill = Number(eval(args[2]));
				var value = Number(eval(args[3]));
				var actor = $gameParty.members()[Number(eval(args[1])) - 1];
				if (actor) actor.changeTechPoints(skill, value);
			}
		}
		if (command.toLowerCase() === 'maxtechpoints') {
			var v = $gameVariables._data;
			if (args[0].toLowerCase() === 'actor') {
				var skill = Number(eval(args[2]));
				var value = Number(eval(args[3]));
				var actor = $gameActors.actor(Number(eval(args[1])));
				if (actor) actor.changeMaxTech(skill, value);
			}
			if (args[0].toLowerCase() === 'party') {
				var skill = Number(eval(args[2]));
				var value = Number(eval(args[3]));
				var actor = $gameParty.members()[Number(eval(args[1])) - 1];
				if (actor) actor.changeMaxTech(skill, value);
			}
		}
		if (command.toLowerCase() === 'recoveralltechpoints') {
			$gameParty.members().forEach(function(actor) {
				actor.recoverAllTechPoints()
			})
		}
	};
	
	//=============================================================================
	// Window_SkillList
	//=============================================================================
	
	VictorEngine.TechPoints.drawSkillCost = Window_SkillList.prototype.drawSkillCost;
	Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
		if (skill.techSkills.isTech) {
			this.drawSkillTechPointCost(skill, x, y, width);
			x -= this._techWidth + 16;
		}
		VictorEngine.TechPoints.drawSkillCost.call(this, skill, x, y, width);
	};
	
	Window_SkillList.prototype.drawSkillTechPointCost = function(skill, x, y, width) {
		this.changeTextColor(this.normalColor());
		var now  = String(this._actor.techPoint(skill.id));
		var max  = String(this._actor.techMax(skill.id));
		var text = VictorEngine.Parameters.TechPoints.TechPointFormat.format(now, max).trim();
		this._techWidth = this.textWidthEx(text);
		this.drawTextEx(text, x + width - this._techWidth, y);
		this.resetFontSettings();
	};
	
})();