/*
 * ==============================================================================
 * ** Victor Engine MV - Character Frames
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.12.16 > First release.
 * ==============================================================================
 */
/*:ja
 * @plugindesc v1.00 フレーム数の異なるキャラクターセットを使えます
 * @author Victor Sant
 *
 * @param Animation Speed
 * @text アニメーション速度
 * @type number
 * @min 1
 * @max 10
 * @desc アニメーションの速度。数字が大きいほど速い
 * 1から10の間の数値
 * @default 1
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/character-frames/
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
 * 説明
 * ===========================================================================
 *
 * 異なるフレーム数のキャラクターを使用するには、
 * キャラクターのファイル名に'[fx]'を追加しなければなりません。
 * 例えば、'Actor'という名前のキャラクターセットを持っていて、
 * それを6フレームにしたい場合、
 * 'Actor[f6]'という名前に変更しなければなりません。
 *
 * ---------------
 *
 * キャラクターセットにカスタムフレーム番号を設定すると、
 * アニメーションのパターンが変更されます。
 * デフォルトでは、
 * 1から3までのフレームが'12321......'のようなパターンで動きます。
 * カスタムフレーム番号を持つキャラクターは、
 * '123123123...'のようなパターンで連続的に動きます。
 *
 */

var Imported = Imported || {};
Imported['VE - Character Frames'] = '1.00';

var VictorEngine = VictorEngine || {};
VictorEngine.CharacterFrames = VictorEngine.CharacterFrames || {};

(function () {

	VictorEngine.CharacterFrames.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.CharacterFrames.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Character Frames', 'VE - Basic Module', '1.06');
	};

	VictorEngine.CharacterFrames.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.CharacterFrames.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.00 - Allows to use character with different number of frames
 * @author Victor Sant
 *
 * @param Animation Speed
 * @desc Increase the speed of the animation for a smooth movement.
 * Numeric value between 1 and 10.
 * @default 0
 *
 * @help 
 *
 *  To use character with different number of frames, you must add '[fx]' to the
 *  character filename where x is the number of frames. For example, you have a
 *  chaset named 'Actor' and want to make it have 6 frames, then you must rename
 *  it 'Actor[f6]'.
 *
 * ---------------
 *
 *	Whan a charset have a custom frame number, the pattern of the animation is
 *  changed. By default the frames goes from 1 to 3, then it go back, with a
 *  pattern like "1 2 3 2 1....". Character with custom frame number
 *  goes continuously, with a patern like "1 2 3 1 2 3..."
 */


(function () {

	//=============================================================================
	// Parameters
	//=============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.CharacterFrames = {};
		VictorEngine.Parameters.CharacterFrames.AnimationSpeed = Number(parameters["Animation Speed"]);
	};

	//=============================================================================
	// ImageManager
	//=============================================================================

	ImageManager.isMultiFrames = function (filename) {
		var result = filename.match(/\[f\d+\]/i);
		return result !== null;
	};

	ImageManager.frameNumber = function (filename) {
		var result = filename.match(/\[f\d+\]/i);
		return Number(result[0].match(/\d+/i));
	};

	//=============================================================================
	// Game_CharacterBase
	//=============================================================================

	VictorEngine.CharacterFrames.maxPattern = Game_CharacterBase.prototype.maxPattern;
	Game_CharacterBase.prototype.maxPattern = function () {
		if (this.isMultiFrames()) {
			return this.frameNumber();
		} else {
			return VictorEngine.CharacterFrames.maxPattern.call(this);
		}
	};

	VictorEngine.CharacterFrames.straighten = Game_CharacterBase.prototype.straighten;
	Game_CharacterBase.prototype.straighten = function () {
		if (this.isMultiFrames()) {
			if (this.hasWalkAnime() || this.hasStepAnime()) this._pattern = 0;
			this._animationCount = 0;
		} else {
			VictorEngine.CharacterFrames.straighten.call(this);
		}
	};

	VictorEngine.CharacterFrames.pattern = Game_CharacterBase.prototype.pattern;
	Game_CharacterBase.prototype.pattern = function () {
		if (this.isMultiFrames()) {
			return this._pattern;
		} else {
			return VictorEngine.CharacterFrames.pattern.call(this);
		}
	};

	VictorEngine.CharacterFrames.isOriginalPattern = Game_CharacterBase.prototype.isOriginalPattern;
	Game_CharacterBase.prototype.isOriginalPattern = function () {
		if (this.isMultiFrames()) {
			return this.pattern() === 0;
		} else {
			return VictorEngine.CharacterFrames.isOriginalPattern.call(this);
		}
	};

	VictorEngine.CharacterFrames.resetPattern = Game_CharacterBase.prototype.resetPattern;
	Game_CharacterBase.prototype.resetPattern = function () {
		if (this.isMultiFrames()) {
			this.setPattern(0);
		} else {
			VictorEngine.CharacterFrames.resetPattern.call(this);
		}
	};

	VictorEngine.CharacterFrames.animationWait = Game_CharacterBase.prototype.animationWait;
	Game_CharacterBase.prototype.animationWait = function () {
		var wait = VictorEngine.CharacterFrames.animationWait.call(this);
		return Math.max(wait * this.animationWaitSpeed() / 10, 2);
	};

	Game_CharacterBase.prototype.isMultiFrames = function () {
		return ImageManager.isMultiFrames(this._characterName);
	};

	Game_CharacterBase.prototype.frameNumber = function () {
		return ImageManager.frameNumber(this._characterName);
	};

	Game_CharacterBase.prototype.animationWaitSpeed = function () {
		return Math.max(10 - VictorEngine.Parameters.CharacterFrames.AnimationSpeed, 0);
	};

	//=============================================================================
	// Sprite_Character
	//=============================================================================

	VictorEngine.CharacterFrames.characterBlockX = Sprite_Character.prototype.characterBlockX;
	Sprite_Character.prototype.characterBlockX = function () {
		if (this._character.isMultiFrames() && !this._isBigCharacter) {
			var index = this._character.characterIndex();
			return index % 4 * this._character.frameNumber();
		} else {
			return VictorEngine.CharacterFrames.characterBlockX.call(this);
		}
	};

	VictorEngine.CharacterFrames.patternWidth = Sprite_Character.prototype.patternWidth;
	Sprite_Character.prototype.patternWidth = function () {
		if (this._tileId === 0 && this._character.isMultiFrames()) {
			if (this._isBigCharacter) {
				return this.bitmap.width / this._character.frameNumber();
			} else {
				return this.bitmap.width / (this._character.frameNumber() * 4);
			}
		} else {
			return VictorEngine.CharacterFrames.patternWidth.call(this);
		}
	};

	//=============================================================================
	// Window_Base
	//=============================================================================

	VictorEngine.CharacterFrames.drawCharacter = Window_Base.prototype.drawCharacter;
	Window_Base.prototype.drawCharacter = function (characterName, characterIndex, x, y) {
		if (ImageManager.isMultiFrames(characterName)) {
			var frames = ImageManager.frameNumber(characterName);
			var bitmap = ImageManager.loadCharacter(characterName);
			var big = ImageManager.isBigCharacter(characterName);
			var pw = bitmap.width / (big ? frames : frames * 4);
			var ph = bitmap.height / (big ? 4 : 8);
			var n = characterIndex;
			var sx = (n % 4 * 3 + 1) * pw;
			var sy = (Math.floor(n / 4) * 4) * ph;
			this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
		} else {
			VictorEngine.CharacterFrames.drawCharacter.call(this, characterName, characterIndex, x, y)
		}

	};

})();


