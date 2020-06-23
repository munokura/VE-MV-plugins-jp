/*
 * ==============================================================================
 * ** Victor Engine MV - Loop Animation
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.03.06 > First release.
 *  v 1.01 - 2016.03.15 > Fixed issue with hiding loop animation.
 *  v 1.02 - 2016.03.17 > Fixed issues with removing states with animations.
 *  v 1.03 - 2016.05.12 > Fixed issue with random crash during battles.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Loop Animation'] = '1.03';

var VictorEngine = VictorEngine || {};
VictorEngine.LoopAnimation = VictorEngine.LoopAnimation || {};

(function () {

	VictorEngine.LoopAnimation.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.LoopAnimation.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Loop Animation', 'VE - Basic Module', '1.13');
	};

	VictorEngine.LoopAnimation.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.LoopAnimation.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.03 - Display looping and cycling animations.
 * @author Victor Sant
 *
 * @param Hide Enemy Icon
 * @desc Hide the display state icons for enemies.
 * true - ON     false - OFF
 * @default true
 *
 * @param Hide Enemy Loop
 * @desc Hide the display state loop animations for enemies.
 * true - ON     false - OFF
 * @default false
 *
 * @param Mirror Animation
 * @desc Mirror looping animations if the battler is facing right.
 * true - ON     false - OFF
 * @default false
 *
 * @help 
 * ------------------------------------------------------------------------------
 * Enemies Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <loop animation: id, type, loop>
 *   Displays a loop animation on the enemy.
 *     id   : Id of the animation. Numeric. 
 *     type : type of the looping animation. Text. (see details bellow).
 *     loop : number of times the animation will repeat. Numeric.
 *
 *  <hide loop animation>
 *   Don't display loop animation on the enemy.
 *
 * ------------------------------------------------------------------------------
 * States Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <loop animation: id, type, loop[, show]>
 *   Displays a loop animation on the battler with the state.
 *     id   : Id of the animation. Numeric. 
 *     type : type of the looping animation. Text. (see details bellow).
 *     loop : number of times the animation will repeat. Numeric.
 *     show : the animation will be displayed only on battle or map. Must be 
 *            equal map or battle.
 *
 * ------------------------------------------------------------------------------
 *  Event Comments
 * ------------------------------------------------------------------------------
 *
 *  <loop animation:id, type, loop>
 *   Displays a loop animation on the event.
 *     id   : Id of the animation. Numeric. 
 *     type : type of the looping animation. Text. (see details bellow).
 *     loop : number of times the animation will repeat. Numeric.
 *
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
 *  AddLoopAnimation actor id anim type loop
 *  AddLoopAnimation party id anim type loop
 *  AddLoopAnimation event id anim type loop
 *    Adds a looping animation to a character or event.
 *      actor : the target will be decided by the actor Id.
 *      party : the target will be decided by the position in party.
 *      event : the target will an event.
 *      anim  : Id of the animation. Numeric. 
 *      type  : type of the looping animation. Text. (see details bellow).
 *      loop  : number of times the animation will repeat. Numeric.
 *
 * ---------------
 *
 *  RemoveLoopAnimation actor anim id type
 *  RemoveLoopAnimation party anim id type
 *  RemoveLoopAnimation event anim id type
 *    Removes a looping animation from a character or event.
 *      actor : the target will be decided by the actor Id.
 *      party : the target will be decided by the position in party.
 *      event : the target will an event.
 *      anim  : Id of the animation. Numeric. 
 *      type  : type of the looping animation. Text. (see details bellow).
 *      loop  : number of times the animation will repeat. Numeric.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 *
 *  Loop Animations added by Plugin Commands will disappear if the current scene
 *  is changed. So battles, opening the menu and such will make the looping
 *  animtion to disappear.
 *
 * ---------------
 *
 *  - Loop Animation Type
 *  The loop animation type is an arbitary text used as an identifier to decide
 *  how the animation cycle. 
 *
 *  Loop animations with the same type will cycle between them. The animation
 *  will play a number of times equal the 'loop' value and then display the next
 *  animation.
 *
 *  Loop animations with the different types will be displayed at the same time.
 *  Avoid overdoing with this, because it may cause Lag.
 *
 * ---------------
 *
 *  - Hide Enemy State Icon
 *  The states looping animation display is out of sync with the icon displayed
 *  for enemies. You can turn on the plugin paramater 'Hide Enemy State Icon'
 *  to hide the enemy icon display.
 *
 *  States overlay for actor's aren't removed, you can remove them if you
 *  wish directly on the state setup.
 *
 * ------------------------------------------------------------------------------
 * Example Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <loop animation: 20, state, 1>
 *
 * ---------------
 *
 *  <loop animation: 22, debuff, 1, map>
 *
 * ---------------
 *
 *  <loop animation: 24, debuff, 1, battle>
 *
 * ------------------------------------------------------------------------------
 * Example Plugin Commands:
 * ------------------------------------------------------------------------------
 *
 *  AddLoopAnimation actor 1 20 state 1
 *
 * ---------------
 *
 *  AddLoopAnimation party 2 22 debuff 1
 *
 * ---------------
 *
 *  AddLoopAnimation event 4 24 effect v[10]
 */
/*:ja
 * @plugindesc v1.03 戦闘とマップでアニメーションをループできます
 * @author Victor Sant
 * 
 * @param Hide Enemy Icon
 * @text 敵ステートアイコン非表示
 * @type boolean
 * @on 非表示
 * @off 表示
 * @desc 敵のステートアイコンを非表示
 * 非表示:true / 表示:false
 * @default true
 * 
 * @param Hide Enemy Loop
 * @text 敵ループアニメーション非表示
 * @type boolean
 * @on 非表示
 * @off 表示
 * @desc 敵のステートのループアニメーションを非表示
 * 非表示:true / 表示:false
 * @default false
 * 
 * @param Mirror Animation
 * @text ミラーリング
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc バトラーが右を向いている場合、ループアニメーションをミラーリング
 * 有効:true / 無効:false
 * @default false
 * 
 * @help 
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 * 
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/loop-animation/
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
 * 敵キャラのメモタグ
 * ---------------------------------------------------------------------------
 * 
 *  <loop animation: id, type, loop>
 *   敵にループアニメーションを表示します。
 *     id   : アニメーションID。数値
 *     type : ループするアニメーションのタイプを指定。文字列 (後述)
 *     loop : アニメーションの繰り返し回数。数値
 * 
 *  <hide loop animation>
 *   敵にループアニメーションを表示しません。
 * 
 * ---------------------------------------------------------------------------
 * ステートのメモタグ
 * ---------------------------------------------------------------------------
 * 
 *  <loop animation: id, type, loop[, show]>
 *   ステートのバトラーにループアニメーションを表示します。
 *     id   : アニメーションID。数値
 *     type : ループするアニメーションのタイプを指定。文字列 (後述)
 *     loop : アニメーションの繰り返し回数。数値
 *     show : アニメーションが表示される場面。任意項目 (battle / map)
 * 
 * ---------------------------------------------------------------------------
 * イベント注釈
 * ---------------------------------------------------------------------------
 * 
 *  <loop animation:id, type, loop>
 *   イベントのループアニメーションを表示します。
 *     id   : アニメーションID。数値
 *     type : ループするアニメーションのタイプを指定。文字列 (後述)
 *     loop : アニメーションの繰り返し回数。数値
 * 
 * --------------------------------------------------------------------------- 
 * プラグインコマンド
 * ---------------------------------------------------------------------------
 * 
 * 数値の代わりにv[id]を使用して、
 * IDが設定された変数から値を取得することができます。
 * 例えば、v[3]は変数ID3から値を取得します。
 * 
 * ---------------
 * 
 *  AddLoopAnimation actor id anim type loop
 *  AddLoopAnimation party id anim type loop
 *  AddLoopAnimation event id anim type loop
 *    キャラクターやイベントにループするアニメーションを追加します。
 *      actor : 対象はアクター
 *      party : 対象はパーティ並び順
 *      event : 対象はイベント
 *      anim  : アニメーションID。数値
 *      type  : ループするアニメーションのタイプを指定。文字列 (後述)
 *      loop  : アニメーションの繰り返し回数。数値
 * 
 * ---------------
 * 
 *  RemoveLoopAnimation actor anim id type
 *  RemoveLoopAnimation party anim id type
 *  RemoveLoopAnimation event anim id type
 *    キャラクターやイベントからループしているアニメーションを削除します。
 *      actor : 対象はアクターID
 *      party : 対象はパーティ並び順
 *      event : 対象はイベントID
 *      anim  : アニメーションID。数値
 *      type  : ループするアニメーションのタイプを指定。文字列 (後述)
 *      loop  : アニメーションの繰り返し回数。数値
 * 
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 * 
 * プラグインコマンドで追加されたループアニメーションは、
 * 現在のシーンを変更すると消えてしまいます。
 * 戦闘やメニューを開いた時などにループしているアニメーションが消えます。
 * 
 * ---------------
 * 
 *  - Loop Animation Type
 * ループアニメーションタイプは、
 * アニメーションのサイクルを決定するためのシンボルとして使用される
 * 任意のテキストです。
 * 
 * 同じタイプのループアニメーションは、それらの間を循環します。
 * アニメーションは'loop'の値に等しい回数だけ再生され、
 * 次のアニメーションが表示されます。
 * 
 * 種類の異なるループアニメーションが同時に表示されます。
 * やりすぎは遅延の原因になるので避けましょう。
 * 
 * ---------------
 * 
 *  - Hide Enemy State Icon
 * ステートのループするアニメーション表示と敵のアイコン表示がずれています。
 * プラグインのパラメタ'Hide Enemy State Icon'をオンにすることで、
 * 敵のアイコン表示を非表示にすることができます。
 * 
 * アクターのステートの'SV重ね合わせ'は削除されません。
 * 
 * ---------------------------------------------------------------------------
 * メモタグの例
 * ---------------------------------------------------------------------------
 * 
 *  <loop animation: 20, state, 1>
 * 
 * ---------------
 * 
 *  <loop animation: 22, debuff, 1, map>
 * 
 * ---------------
 * 
 *  <loop animation: 24, debuff, 1, battle>
 * 
 * ---------------------------------------------------------------------------
 * プラグインコマンドの例
 * ---------------------------------------------------------------------------
 * 
 *  AddLoopAnimation actor 1 20 state 1
 * 
 * ---------------
 * 
 *  AddLoopAnimation party 2 22 debuff 1
 * 
 * ---------------
 * 
 *  AddLoopAnimation event 4 24 effect v[10]
 */

(function () {

	//=============================================================================
	// Parameters
	//=============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.LoopAnimation = {};
		VictorEngine.Parameters.LoopAnimation.HideEnemyIcon = eval(parameters["Hide Enemy Icon"]);
		VictorEngine.Parameters.LoopAnimation.HideEnemyLoop = eval(parameters["Hide Enemy Loop"]);
		VictorEngine.Parameters.LoopAnimation.MirrorLoopAnim = eval(parameters["Mirror Animation"]);
	}
	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.LoopAnimation.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.LoopAnimation.loadNotetagsValues.call(this, data, index);
		var list = ['enemy', 'state'];
		if (this.objectSelection(index, list)) VictorEngine.LoopAnimation.loadNotes(data);
	};

	VictorEngine.LoopAnimation.loadNotes = function (data) {
		data.loopAnimation = data.loopAnimation || {};
		this.processNotes(data);
	};

	VictorEngine.LoopAnimation.processNotes = function (data) {
		var match;
		var part1 = '(\\d+)[ ]*,[ ]*(\\w+)[ ]*,[ ]*(\\d+)[ ]*(?:,[ ]*(map|battle))?';
		var regex1 = new RegExp('<loop animation:[ ]*' + part1 + '[ ]*>', 'gi');
		var regex2 = new RegExp('<hide loop animation>', 'gi');
		while ((match = regex1.exec(data.note)) !== null) { this.processValues(data, match) };
		data.loopAnimation.hideDisplay = !!data.note.match(regex2);
	};

	VictorEngine.LoopAnimation.processValues = function (data, match) {
		var result = {};
		result.id = Number(match[1]) || 0;
		result.type = match[2].trim() || '';
		result.loop = Number(match[3]) || 1;
		result.show = match[4] || 'all';
		data.loopAnimation[result.type] = result;
	};

	//=============================================================================
	// Game_Battler
	//=============================================================================

	VictorEngine.LoopAnimation.initMembersGameBattler = Game_Battler.prototype.initMembers;
	Game_Battler.prototype.initMembers = function () {
		VictorEngine.LoopAnimation.initMembersGameBattler.call(this);
		this.clearLoopAnimation();
	};

	Game_Battler.prototype.clearLoopAnimation = function () {
		this._addLoopAnimation = [];
		this._removeLoopAnimation = [];
	};

	Game_Battler.prototype.addLoopAnimation = function (data) {
		this._addLoopAnimation.push(data);
	};

	Game_Battler.prototype.removeLoopAnimation = function (data, type) {
		this._removeLoopAnimation.push(data);
	};

	Game_Battler.prototype.hideLoopDisplay = function () {
		return false;
	};

	//=============================================================================
	// Game_Enemy
	//=============================================================================

	VictorEngine.LoopAnimation.setupGameEnemy = Game_Enemy.prototype.setup;
	Game_Enemy.prototype.setup = function (enemyId, x, y) {
		VictorEngine.LoopAnimation.setupGameEnemy.call(this, enemyId, x, y);
		this.refreshLoopAnimations();
	};

	Game_Enemy.prototype.refreshLoopAnimations = function () {
		var animations = this.enemy().loopAnimation;
		Object.keys(animations).forEach(function (type) {
			this.addLoopAnimation(animations[type]);
		}, this);
	};

	Game_Enemy.prototype.hideLoopDisplay = function () {
		return VictorEngine.Parameters.LoopAnimation.HideEnemyLoop || this.enemy().loopAnimation.hideDisplay;
	};

	//=============================================================================
	// Game_CharacterBase
	//=============================================================================

	VictorEngine.LoopAnimation.initMembersGameCharacterBase = Game_CharacterBase.prototype.initMembers;
	Game_CharacterBase.prototype.initMembers = function () {
		VictorEngine.LoopAnimation.initMembersGameCharacterBase.call(this);
		this.clearLoopAnimation();
	};

	Game_CharacterBase.prototype.clearLoopAnimation = function () {
		this._addLoopAnimation = [];
		this._removeLoopAnimation = [];
	};

	Game_CharacterBase.prototype.addLoopAnimation = function (data) {
		this._addLoopAnimation.push(data);
	};

	Game_CharacterBase.prototype.removeLoopAnimation = function (data) {
		this._removeLoopAnimation.push(data);
	};

	Game_CharacterBase.prototype.actor = function () {
		return null;
	};

	//=============================================================================
	// Game_Player
	//=============================================================================

	Game_Player.prototype.actor = function () {
		return $gameParty.leader();
	};

	//=============================================================================
	// Game_Event
	//=============================================================================

	VictorEngine.LoopAnimation.clearStartingFlag = Game_Event.prototype.clearStartingFlag;
	Game_Event.prototype.clearStartingFlag = function () {
		VictorEngine.LoopAnimation.clearStartingFlag.call(this);
		this.refreshLoopAnimations();
	};

	Game_Event.prototype.refreshLoopAnimations = function () {
		if (this.page()) {
			var note = VictorEngine.getPageNotes(this);
			var part1 = '(\\d+)[ ]*,[ ]*(\\w+)[ ]*,[ ]*(\\d+)';
			var regex = new RegExp('<loop animation:[ ]*' + part1 + '[ ]*>', 'gi');
			while ((match = regex.exec(note)) !== null) {
				var result = {};
				result.id = Number(match[1]) || 0;
				result.type = match[2].trim() || '';
				result.loop = Number(match[3]) || 1;
				this.addLoopAnimation(result);
			};
		}
	};

	//=============================================================================
	// Game_Interpreter
	//=============================================================================

	VictorEngine.LoopAnimation.pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		VictorEngine.LoopAnimation.pluginCommand.call(this, command, args);
		if (command.toLowerCase() === 'addloopanimation') {
			var v = $gameVariables._data;
			var result = {};
			result.id = Number(eval(args[2])) || 0;
			result.type = String(args[3]).trim() || '';
			result.loop = Number(eval(args[4])) || 1;
			if (args[0].toLowerCase() === 'event') {
				var event = $gameMap.event(Number(eval(args[1])));
				if (event) event.addLoopAnimation(result);
			}
			if (args[0].toLowerCase() === 'actor') {
				var id = Number(eval(args[1]))
				var index = $gameParty.members().indexOf($gameActors.actor(id));
				var actor = $gamePlayer.follower(index);
				if (actor) actor.addLoopAnimation(result);
			}
			if (args[0].toLowerCase() === 'party') {
				var index = Number(eval(args[1])) - 1;
				var actor = $gamePlayer.follower(index);
				if (actor) actor.addLoopAnimation(result);
			}
		}
		if (command.toLowerCase() === 'removeloopanimation') {
			var v = $gameVariables._data;
			var result = {};
			result.id = Number(eval(args[2])) || 0;
			result.type = String(args[3]).trim() || '';
			if (args[0].toLowerCase() === 'event') {
				var event = $gameMap.event(Number(eval(args[1])));
				if (event) event.removeLoopAnimation(result);
			}
			if (args[0].toLowerCase() === 'actor') {
				var id = Number(eval(args[1]))
				var index = $gameParty.members().indexOf($gameActors.actor(id));
				var actor = $gamePlayer.follower(index);
				if (actor) actor.removeLoopAnimation(result);
			}
			if (args[0].toLowerCase() === 'party') {
				var index = Number(eval(args[1])) - 1;
				var actor = $gamePlayer.follower(index);
				if (actor) actor.removeLoopAnimation(result);
			}
		}
	};

	//=============================================================================
	// Sprite_Base
	//=============================================================================

	VictorEngine.LoopAnimation.initializeSpriteBase = Sprite_Base.prototype.initialize;
	Sprite_Base.prototype.initialize = function () {
		VictorEngine.LoopAnimation.initializeSpriteBase.call(this);
		this._loopStatesAnim = []
		this._loopAnimSprites = {};
		this._loopAnimations = {};
	};

	VictorEngine.LoopAnimation.update = Sprite_Base.prototype.update;
	Sprite_Base.prototype.update = function () {
		VictorEngine.LoopAnimation.update.call(this);
		this.updateStateLoop();
		this.updateSpriteLoopAnimations();
		this.updateLoopAnimation();
	};

	Sprite_Base.prototype.updateLoopAnimation = function () {
		Object.keys(this._loopAnimations).forEach(function (type) {
			this.updateLoopAnimationSprites(type);
			this.updateLoopAnimationValues(type);
		}, this);
	};

	Sprite_Base.prototype.updateLoopAnimationSprites = function (type) {
		if (this.isLoopAnimationPlaying(type)) {
			var sprites = this._loopAnimSprites[type].clone();
			this._loopAnimSprites[type] = [];
			for (var i = 0; i < sprites.length; i++) {
				var sprite = sprites[i];
				if (sprite.isPlaying()) {
					sprite.visible = this.isSpriteVisible();
					this._loopAnimSprites[type].push(sprite);
				} else if (this.animationIsLooping(type)) {
					this._loopAnimations[type].loop--;
					var data = this._loopAnimations[type].data[0];
					var index = this.parent.children.indexOf(sprite);
					sprite.remove();
					if (data) this.refreshLoopAnimation(data, type, index);
				} else if (this.hasLoopingAnimation(type)) {
					var index = this.parent.children.indexOf(sprite);
					sprite.remove();
					this.startLoopAnimation(type, index)
				} else {
					sprite.remove();
				}
			}
		}
	};

	Sprite_Base.prototype.updateLoopAnimationValues = function (type) {
		if (!this.isLoopAnimationPlaying(type) && this.hasLoopingAnimation(type)) {
			this.startLoopAnimation(type);
		} else if (this.isLoopAnimationPlaying(type) && !this.hasLoopingAnimation(type)) {
			this.clearLoopAnimation(type);
		}
	};

	Sprite_Base.prototype.startLoopAnimation = function (type, index) {
		if (this._loopAnimations[type]) {
			var anim = this._loopAnimations[type];
			var data = anim.data.shift();
			anim.data.push(data);
			for (var i = 0; i < anim.data.length; i++) {
				if (!anim.data[i]) {
					anim.data.splice(i, 1);
					i--;
				}
			};
			this.refreshLoopAnimation(data, type, index);
			anim.loop = data.loop - 1;
		}
	};

	Sprite_Base.prototype.refreshLoopAnimation = function (data, type, index) {
		this._loopAnimSprites[type] = this._loopAnimSprites[type] || [];
		var sprite = new Sprite_Animation();
		var mirror = this.isMirrorAnimation();
		var animation = $dataAnimations[data.id];
		sprite.setup(this._effectTarget, animation, mirror, 0);
		sprite.visible = this.isSpriteVisible();
		this._loopAnimSprites[type].push(sprite);
		this.parent.addChildAt(sprite, index || this.parent.children.length);
	};

	Sprite_Base.prototype.clearLoopAnimation = function (type) {
		if (this.isLoopAnimationPlaying(type)) {
			var sprites = this._loopAnimSprites[type].clone();
			this._loopAnimSprites[type] = [];
			for (var i = 0; i < sprites.length; i++) { sprites[i].remove() };
		}
	};

	Sprite_Base.prototype.isLoopAnimationPlaying = function (type) {
		return this._loopAnimSprites[type] && this._loopAnimSprites[type].length > 0;
	};

	Sprite_Base.prototype.animationIsLooping = function (type) {
		return this._loopAnimations[type] && this._loopAnimations[type].loop > 0;
	};

	Sprite_Base.prototype.hasLoopingAnimation = function (type) {
		return this._loopAnimations[type] && this._loopAnimations[type].data.length > 0;
	};

	Sprite_Base.prototype.updateSpriteLoopAnimations = function () {
		var object = this._character ? this._character : this._battler;
		if (object) {
			object._addLoopAnimation.forEach(function (data) { this.addLoopAnimation(data) }, this);
			object._removeLoopAnimation.forEach(function (data) { this.removeLoopAnimation(data) }, this);
			object.clearLoopAnimation();
		}
	};

	Sprite_Base.prototype.addLoopAnimation = function (data) {
		var type = data.type;
		if (!this.hideLoopDisplay()) {
			if (this._loopAnimations[type] && this._loopAnimations[type].data.length > 0) {
				if (!this.includeLoopAnimation(data)) this._loopAnimations[type].data.push(data);
			} else {
				this._loopAnimations[type] = {};
				this._loopAnimations[type].data = [data];
			}
		}
	};

	Sprite_Base.prototype.removeLoopAnimation = function (data) {
		var type = data.type;
		if (this._loopAnimations[type] && this._loopAnimations[type].data.length > 0) {
			for (var i = 0; i < this._loopAnimations[type].data.length; i++) {
				if (data.id === this._loopAnimations[type].data[i].id) {
					this._loopAnimations[type].data.splice(i, 1);
				}
			}
		}
	};

	Sprite_Base.prototype.includeLoopAnimation = function (data) {
		this._loopAnimations[data.type].data.some(function (anim2) { return data.id === anim2.id });
	};

	Sprite_Base.prototype.addStateAnimations = function (oldStates, newStates, show) {
		newStates.forEach(function (state) {
			if (!oldStates.contains(state)) this.addStateAnimationsData(state, show);
		}, this)
	};

	Sprite_Base.prototype.addStateAnimationsData = function (state, show) {
		Object.keys(state.loopAnimation).forEach(function (type) {
			var data = state.loopAnimation[type];
			if (data && (data.show === 'all' || show === data.show)) this.addLoopAnimation(data);
		}, this);
	};

	Sprite_Base.prototype.removeStateAnimations = function (oldStates, newStates, show) {
		oldStates.forEach(function (state) {
			if (!newStates.contains(state)) this.removeStateAnimationsData(state, show);
		}, this)
	};

	Sprite_Base.prototype.removeStateAnimationsData = function (state, show) {
		Object.keys(state.loopAnimation).forEach(function (type) {
			var data = state.loopAnimation[type];
			if (data && (data.show === 'all' || show === data.show)) this.removeLoopAnimation(data);
		}, this);
	};

	Sprite_Base.prototype.updateStateLoop = function () {
	};

	Sprite_Base.prototype.hideLoopDisplay = function () {
		return false;
	};

	Sprite_Base.prototype.isMirrorAnimation = function () {
		return false;
	};

	Sprite_Base.prototype.isSpriteVisible = function () {
		return !this._hideLoopAnimations;
	};

	Sprite_Base.prototype.hideLoopAnimations = function () {
		return this._hideLoopAnimations = true;
	};

	//=============================================================================
	// Sprite_Character
	//=============================================================================

	VictorEngine.LoopAnimation.updateSpriteAnimation = Sprite_Animation.prototype.update;
	Sprite_Animation.prototype.update = function () {
		if (this._target.isSpriteVisible()) {
			VictorEngine.LoopAnimation.updateSpriteAnimation.call(this);
		}
	};

	//=============================================================================
	// Sprite_Character
	//=============================================================================

	Sprite_Character.prototype.actor = function () {
		return this._character.actor();
	};

	Sprite_Character.prototype.updateStateLoop = function () {
		if (this.actor() && this.isLoopStateChanged()) {
			var oldStates = this._loopStatesAnim;
			var newStates = this.actor().states();
			this.removeStateAnimations(oldStates, newStates, 'map');
			this.addStateAnimations(oldStates, newStates, 'map');
			this._loopStatesAnim = this.actor().states().clone();
		}
	};

	Sprite_Character.prototype.isLoopStateChanged = function () {
		var oldStates = this._loopStatesAnim;
		var newStates = this.actor().states();
		return oldStates.length !== newStates.length || oldStates.some(function (state, i) {
			return state !== newStates[i];
		});
	};

	//=============================================================================
	// Sprite_Battler
	//=============================================================================

	Sprite_Battler.prototype.hideLoopDisplay = function () {
		return this.isEnemy() && this._battler.hideLoopDisplay();
	};

	Sprite_Battler.prototype.isSpriteVisible = function () {
		return this._battler && this._battler.isSpriteVisible();
	};

	Sprite_Battler.prototype.isMirrorAnimation = function () {
		return VictorEngine.Parameters.LoopAnimation.MirrorLoopAnim && this._battler && this._battler.isFacingRight();
	};

	Sprite_Battler.prototype.updateStateLoop = function () {
		if (this._battler && this.isLoopStateChanged()) {
			var oldStates = this._loopStatesAnim;
			var newStates = this._battler.states();
			this.removeStateAnimations(oldStates, newStates, 'battle');
			this.addStateAnimations(oldStates, newStates, 'battle');
			this._loopStatesAnim = this._battler.states().clone();
		}
	};

	Sprite_Battler.prototype.isLoopStateChanged = function () {
		var oldStates = this._loopStatesAnim;
		var newStates = this._battler.states();
		return oldStates.length !== newStates.length || oldStates.some(function (state, i) {
			return state !== newStates[i];
		});
	};

	//=============================================================================
	// Sprite_Enemy
	//=============================================================================

	VictorEngine.LoopAnimation.updateStateSprite = Sprite_Enemy.prototype.updateStateSprite;
	Sprite_Enemy.prototype.updateStateSprite = function () {
		VictorEngine.LoopAnimation.updateStateSprite.call(this);
		if (VictorEngine.Parameters.LoopAnimation.HideEnemyIcon) this._stateIconSprite.opacity = 0;
	};

	//=============================================================================
	// Spriteset_Map
	//=============================================================================

	Spriteset_Map.prototype.hideLoopAnimations = function () {
		for (var i = 0; i < this._characterSprites.length; i++) {
			var sprite = this._characterSprites[i];
			if (!sprite.isTile()) sprite.hideLoopAnimations();
		}
	};

	//=============================================================================
	// Scene_Map
	//=============================================================================

	VictorEngine.LoopAnimation.start = Scene_Map.prototype.start;
	Scene_Map.prototype.start = function () {
		$gameMap.events().forEach(function (event) { event.refreshLoopAnimations() });
		this._spriteset.update();
		VictorEngine.LoopAnimation.start.call(this);
	};

	VictorEngine.LoopAnimation.startEncounterEffect = Scene_Map.prototype.startEncounterEffect;
	Scene_Map.prototype.startEncounterEffect = function () {
		this._spriteset.hideLoopAnimations();
		VictorEngine.LoopAnimation.startEncounterEffect.call(this);
	};

})();