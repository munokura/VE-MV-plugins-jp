/*
 * ==============================================================================
 * ** Victor Engine MV - Direct Commands
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.12.28 > First release
 *  v 1.01 - 2016.03.12 > Added custom code notetags.
 *  v 1.02 - 2016.04.04 > Compatibility with 'Battle Status Window'.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Direct Commands'] = '1.02';

var VictorEngine = VictorEngine || {};
VictorEngine.DirectCommands = VictorEngine.DirectCommands || {};

(function () {

	VictorEngine.DirectCommands.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.DirectCommands.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Direct Commands', 'VE - Basic Module', '1.05');
	};

	VictorEngine.DirectCommands.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.DirectCommands.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.02 - Set commands that uses item or skills directly.
 * @author Victor Sant
 *
 * @help 
 * ------------------------------------------------------------------------------
 * Actors, Classes, Weapons, Armors and States Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <direct skill: x[, y]>
 *    x : skill id.
 *    y : condition.(usable or learned, opitional)
 *
 * ---------------
 *
 *  <direct item: x[, y]>
 *    x : item id.
 *    y : condition. (usable or possession, opitional)
 *
 * ---------------
 *
 *  <custom direct skill[: x]>
 *   result = code
 *  </custom direct skill>
 *     x    : condition. (usable or possession, opitional)
 *     code : code that will return the skill Id.
 *
 * ---------------
 *
 *  <custom direct item[: x]>
 *   result = code
 *  </custom direct item>
 *     x    : condition. (usable or possession, opitional)
 *     code : code that will return the item Id.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  The skills and items costs and requirements for use still valid for direct
 *  commands actions. So if an action consume MP, it will not be usable if
 *  the is lower than required. Costs are still consumed normally.
 *
 * ---------------
 *
 *  If the conditions usable, learned (for skills) or possession (for items)
 *  are set, the commands will not show up until the condition is met.
 *
 * ---------------
 *
 *  Skills set as commands are not displayed on the actor skill list even if
 *  the actor learned the skill.
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <direct skill: 4>
 *
 * ---------------
 *
 *  <direct skill: 5, usable>
 *
 * ---------------
 *
 *  <direct skill: 6, learned>
 *
 * ---------------
 *
 *  <direct item: 2, possession>
 *
 * ---------------
 *
 *  <custom direct skill: usable>
 *   if ($gameParty.aliveMembers().length === 1) {
 *       result = 10
 *   } else {
 *       result = 0
 *   }
 *  </custom direct item>
 */
/*:ja
 * @plugindesc v1.02 - 戦闘中のアクターコマンドを特定条件で追加できます
 * @author Victor Sant
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/direct-commands/
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
 *  <direct skill: x[, y]>
 *    x : スキルID
 *    y : 条件 - 任意項目 (使用可能:usable / 習得済み:learned)
 * ---------------
 *
 *  <direct item: x[, y]>
 *    x : アイテムID
 *    y : 条件 - 任意項目 (使用可能:usable / 所持済み:possession)
 *
 * ---------------
 *
 *  <custom direct skill[: x]>
 *   result = code
 *  </custom direct skill>
 *     x    : 条件 - 任意項目 (使用可能:usable / 所持済み:possession)
 *     code : スキルIDを返すコード
 *
 * ---------------
 *
 *  <custom direct item[: x]>
 *   result = code
 *  </custom direct item>
 *     x    : 条件 - 任意項目 (使用可能:usable / 所持済み:possession)
 *     code : アイテムIDを返すコード
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 * スキルやアイテムのコストや使用条件は、
 * ダイレクトコマンドのアクションでも有効です。
 * あるアクションでMPを消費した場合、
 * そのMPが必要以上に低いと使用できなくなります。
 * コストは通常通り消費されます。
 *
 * ---------------
 *
 * '使用可能:usable'、'習得済み(スキルの場合):learned'、
 * '所持済み(アイテムの場合):possession'の条件が設定されている場合、
 * 条件を満たすまでコマンドは表示されません。
 *
 * ---------------
 *
 * ダイレクトコマンドとして設定されたスキルは、
 * アクターがスキルを習得してもアクタースキル一覧に表示されません。
 *
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 *
 *  <direct skill: 4>
 *
 * ---------------
 *
 *  <direct skill: 5, usable>
 *
 * ---------------
 *
 *  <direct skill: 6, learned>
 *
 * ---------------
 *
 *  <direct item: 2, possession>
 *
 * ---------------
 *
 *  <custom direct skill: usable>
 *   if ($gameParty.aliveMembers().length === 1) {
 *       result = 10
 *   } else {
 *       result = 0
 *   }
 *  </custom direct item>
 *
 */

(function () {

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.DirectCommands.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.DirectCommands.loadNotetagsValues.call(this, data, index);
		var list = ['actor', 'class', 'weapon', 'armor', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.DirectCommands.loadNotes(data);
	};

	VictorEngine.DirectCommands.loadNotes = function (data) {
		data.directCommands = data.directCommands || {};
		data.directCommands.skill = data.directCommands.skill || [];
		data.directCommands.item = data.directCommands.item || [];
		this.processNotes(data);
	};

	VictorEngine.DirectCommands.processNotes = function (data) {
		var match;
		var part1 = 'direct (item|skill)'
		var part2 = '(?:[ ]*:,[ ]*(usable|learned|possession))?'
		var regex1 = new RegExp('<' + part1 + ':[ ]*(\\d+)' + part2 + '[ ]*>', 'gi');
		var regex2 = VictorEngine.getNotesValues('custom ' + part1 + part2, 'custom ' + part1);
		while ((match = regex1.exec(data.note)) !== null) { this.processValues(data, match, false) };
		while ((match = regex2.exec(data.note)) !== null) { this.processValues(data, match, true) };
	};

	VictorEngine.DirectCommands.processValues = function (data, match, code) {
		var result = {};
		var type = match[1].toLowerCase();
		result.id = code ? 0 : Number(match[2]);
		result.code = code ? match[3].trim() : '';
		result.usable = match[code ? 2 : 3] || '';
		data.directCommands[type].push(result);
	};

	//=============================================================================
	// Game_Actor
	//=============================================================================

	Game_Actor.prototype.directSkills = function () {
		var list = this.getDirectSkills();
		return list.filter(function (item, index) {
			return list.indexOf(item) === index;
		}, []).sort(function (a, b) { return a.id - b.id });
	};

	Game_Actor.prototype.getDirectSkills = function () {
		var list = this.directCommandsObjects('skill');
		return list.filter(function (item, i) {
			return this.isDirectSkill(item);
		}, this).reduce(function (r, item) { return r.concat($dataSkills[item.id]) }, [])
	};

	Game_Actor.prototype.isDirectSkill = function (data) {
		item = $dataSkills[data.id];
		if (!data.id || !item) return false;
		if (data.usable === 'usable' && !this.canUse(item)) return false;
		if (data.usable === 'learned' && !this.isLearnedSkill(item.id)) return false;
		return true;
	};

	Game_Actor.prototype.directItems = function () {
		var list = this.getDirectItems();
		var result = list.filter(function (item, index) {
			return list.indexOf(item) === index;
		}, []).sort(function (a, b) { return a.id - b.id });
		return result
	};

	Game_Actor.prototype.getDirectItems = function () {
		var list = this.directCommandsObjects('item');
		return list.filter(function (item, i) {
			return this.isDirectItem(item);
		}, this).reduce(function (r, item) { return r.concat($dataItems[item.id]) }, [])
	};

	Game_Actor.prototype.isDirectItem = function (data) {
		item = $dataItems[data.id];
		if (!data.id || !item) return false;
		if (data.usable === 'usable' && !this.canUse(item)) return false;
		if (data.usable === 'possession' && !$gameParty.hasItem(item)) return false;
		return true;
	};

	Game_Actor.prototype.directCommandsObjects = function (type) {
		var object = this;
		return this.traitObjects().reduce(function (r, data) {
			var result = object.directCommandsItem(data.directCommands[type])
			return r.concat(result || []);
		}, []);
	};

	Game_Actor.prototype.directCommandsItem = function (values) {
		var a = this;
		var v = $gameVariables._data;
		return values.reduce(function (r, data) {
			if (data.code) {
				try {
					var result = 0;
					eval(data.code);
					return r.concat({ id: result || 0, usable: data.usable });
				} catch (e) {
					return r;
				}
			} else {
				return r.concat(data)
			}
		}, []);
	};

	//=============================================================================
	// Window_ActorCommand
	//=============================================================================

	VictorEngine.DirectCommands.addSkillCommands = Window_ActorCommand.prototype.addSkillCommands;
	Window_ActorCommand.prototype.addSkillCommands = function () {
		VictorEngine.DirectCommands.addSkillCommands.call(this);
		this._actor.directSkills().forEach(function (skill) {
			this.addCommand(skill.name, 'direct skill', this._actor.canUse(skill), skill.id);
		}, this);
		this._actor.directItems().forEach(function (item) {
			this.addCommand(item.name, 'direct item', this._actor.canUse(item), item.id)
		}, this);
	};

	//=============================================================================
	// Window_SkillType
	//=============================================================================

	VictorEngine.DirectCommands.makeCommandList = Window_SkillType.prototype.makeCommandList;
	Window_SkillType.prototype.makeCommandList = function () {
		VictorEngine.DirectCommands.makeCommandList.call(this);
		if (this._actor) {
			this._actor.directSkills().forEach(function (skill) {
				this.addCommand(skill.name, 'direct skill', true, skill.id);
			}, this);
			this._actor.directItems().forEach(function (item) {
				this.addCommand(item.name, 'direct item', true, item.id)
			}, this);
		}
	};

	VictorEngine.DirectCommands.updateHelp = Window_SkillType.prototype.updateHelp;
	Window_SkillType.prototype.updateHelp = function () {
		VictorEngine.DirectCommands.updateHelp.call(this)
		if (this.currentSymbol() === 'direct skill') var item = $dataSkills[this.currentExt()];
		if (this.currentSymbol() === 'direct item') var item = $dataItems[this.currentExt()];
		if (item) this.setHelpWindowItem(item);
	};

	//=============================================================================
	// Window_SkillList
	//=============================================================================

	VictorEngine.DirectCommands.makeItemList = Window_SkillList.prototype.makeItemList;
	Window_SkillList.prototype.makeItemList = function () {
		VictorEngine.DirectCommands.makeItemList.call(this);
		if (this._actor) {
			this._data = this._data.filter(function (item) {
				return !this._actor.directSkills().contains(item);
			}, this);
		}
	};

	//=============================================================================
	// Scene_Battle
	//=============================================================================

	VictorEngine.DirectCommands.createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
	Scene_Battle.prototype.createActorCommandWindow = function () {
		VictorEngine.DirectCommands.createActorCommandWindow.call(this);
		this._actorCommandWindow.setHandler('direct skill', this.commandDirectSkill.bind(this));
		this._actorCommandWindow.setHandler('direct item', this.commandDirectItem.bind(this));
	};

	VictorEngine.DirectCommands.onActorCancel = Scene_Battle.prototype.onActorCancel;
	Scene_Battle.prototype.onActorCancel = function () {
		VictorEngine.DirectCommands.onActorCancel.call(this);
		switch (this._actorCommandWindow.currentSymbol()) {
			case 'direct skill': case 'direct item':
				this._actorCommandWindow.activate();
				break;
		}
	};

	VictorEngine.DirectCommands.onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
	Scene_Battle.prototype.onEnemyCancel = function () {
		VictorEngine.DirectCommands.onEnemyCancel.call(this);
		switch (this._actorCommandWindow.currentSymbol()) {
			case 'direct skill': case 'direct item':
				this._actorCommandWindow.activate();
				break;
		}
	};

	Scene_Battle.prototype.commandDirectSkill = function () {
		var skillId = this._actorCommandWindow.currentExt();
		BattleManager.inputtingAction().setSkill(skillId);
		this.onSelectAction();
	};

	Scene_Battle.prototype.commandDirectItem = function () {
		var itemId = this._actorCommandWindow.currentExt();
		BattleManager.inputtingAction().setSkill(itemId);
		this.onSelectAction();
	};

})();