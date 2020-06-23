/*
 * ==============================================================================
 * ** Victor Engine MV - Sprite In Windows
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.05.07 > First release.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Sprite In Windows'] = '1.00';

var VictorEngine = VictorEngine || {};
VictorEngine.SpriteInWindows = VictorEngine.SpriteInWindows || {};

(function () {

	VictorEngine.SpriteInWindows.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.SpriteInWindows.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Sprite In Windows', 'VE - Basic Module', '1.19');
	};

	VictorEngine.SpriteInWindows.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.SpriteInWindows.requiredPlugin.call(this, name, required, version);
		};
	};

})();

/*:
 * @plugindesc v1.00 - Add animated sprites of battlers and charsets on windows.
 * @author Victor Sant
 *
 * @param = SV Sprite Display =
 * @default ============================================
 *
 * @param Sprite Offset X
 * @desc Offset position X for sprite display.
 * default: 32 (Numeric)
 * @default 32
 *
 * @param Sprite Offset Y
 * @desc Offset position Y for sprite display.
 * default: 32 (Numeric)
 * @default 32
 *
 * @param MenuStatus Sprite
 * @desc Display actor sv sprite on Menu Status window.
 * always, active or select (leave blank for no sprite)
 * @default always
 *
 * @param SkillStatus Sprite
 * @desc Display actor sv sprite on Skill Status window.
 * always (leave blank for no sprite)
 * @default always
 *
 * @param Status Sprite
 * @desc Display actor sv sprite on Status window.
 * always (leave blank for no sprite)
 * @default always
 *
 * @param NameEdit Sprite
 * @desc Display actor sv sprite on Name Edit window.
 * always (leave blank for no sprite)
 * @default always
 *
 * @param = Charset Display =
 * @default ============================================
 *
 * @param Charset Offset X
 * @desc Offset position X for charset display.
 * default: 56 (Numeric)
 * @default 56
 *
 * @param Charset Offset Y
 * @desc Offset position Y for charset display.
 * default: 56 (Numeric)
 * @default 56
 *
 * @param MenuStatus Charset
 * @desc Display actor charset on Menu Status window.
 * always, active or select (leave blank for no charset)
 * @default @@
 *
 * @param SkillStatus Charset
 * @desc Display actor charset on Skill Status window.
 * always (leave blank for no charset)
 * @default @@
 *
 * @param Status Charset
 * @desc Display actor charset on Status window.
 * always (leave blank for no charset)
 * @default @@
 *
 * @param NameEdit Charset
 * @desc Display actor charset on Name Edit window.
 * always (leave blank for no charset)
 * @default @@
 *
 * @param == Face Display ==
 * @default ============================================
 *
 * @param MenuStatus Face
 * @desc Display actor sv sprite on Menu Status window.
 * true - ON     false - OFF
 * @default true
 *
 * @param SkillStatus Face
 * @desc Display actor sv sprite on Skill Status window.
 * true - ON     false - OFF
 * @default true
 *
 * @param Status Face
 * @desc Display actor sv sprite on Status window.
 * true - ON     false - OFF
 * @default true
 *
 * @param NameEdit Face
 * @desc Display actor sv sprite on Name Edit window.
 * true - ON     false - OFF
 * @default true
 *
 * @help 
 * ------------------------------------------------------------------------------
 * Actors Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <damaged window charset: 'filename', index, direction>
 *    This will set a 'damaged' pose for when the actor is dead. Relevant only
 *    for the charset display.
 *      filename  : filename of the charset. Must be always inside quotations.
 *      index     : index of the charset on the character sheet. (0-7)
 *      direction : direction of charset. Must be down, left, right or up.
 *        Ex.: <damaged charset: 'Damage1', 0, down>  // Harold
 *             <damaged charset: 'Damage1', 1, up>    // Therese
 *             <damaged charset: 'Damage1', 5, up>    // Marsha
 *             <damaged charset: 'Damage1', 3, right> // Lucius
 *    The damaged poses charset generally comes with various characters at each
 *    sheet, each in one direction. The examples above shows the damaged charset
 *    for each of the default characters.
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
 *  DamagedWindowCharset actor filename index direction
 *    Changes the damaged charset for the actor battlerwhen using the chasert
 *    mode (see bellow).
 *      actor     : actor Id.
 *      filename  : filename of the charset. Must be always inside quotations.
 *      index     : index of the charset on the character sheet. (0-7)
 *      direction : direction of charset. Must be down, left, right or up.
 *        Ex.: DamagedWindowCharset 1 Damage1 0 down   // Harold
 *             DamagedWindowCharset 2 Damage1 1 up     // Therese
 *             DamagedWindowCharset 3 Damage1 5 up     // Marsha
 *             DamagedWindowCharset 4 Damage1 3 right  // Lucius
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  - Sprite and Charset Display
 *  The sprite and charset display have effect only on the Status, Menu Status,
 *  Skill Status and Name Edit windows. Other windows will not be affected by
 *  the setup. To add battler sprite or charset to other windows, you will need
 *  to add the code manually on that window. Obviously this requires some
 *  scripting knowledge.
 * 
 *  IMPORTANT: While I do offer support to add the display on windows created by
 *  the default code or my own plugins, I will NOT offer support on the code for
 *  adding sprites on windows created by other authors plugins. Do it at your own
 *  risk.
 *
 * ---------------
 *
 *  - Adding Sprites on windows.
 *  To add a battler sprite, you need to add the following code on the window.
 *  The codes should be placed on the part of the code that draws the window
 *  information, this vary from window to window, so I can't say exactly where
 *  you must place it. You will have to find out by your own.
 *
 *  - For battler sprites:
 *    this.drawBattlerSprite(battler, x, y, mode, index);
 *       battler : the Game_Battler object.
 *       x : position X on the window.
 *       y : position Y on the window.
 *       mode  : sprite update mode. 'always', 'active' or 'select'
 *       index : option index.
 *
 *  - For charset sprites: (valid only for actors)
 *    this.drawCharsetSprite(battler, x, y, direction, mode, index);
 *       battler : the Game_Battler object.
 *       x : position X on the window.
 *       y : position Y on the window.
 *       direction : direction of charset. ('down', 'left', 'right' or 'up')
 *       mode  : sprite update mode. ('always', 'active' or 'select')
 *       index : index of the option.
 *
 * ---------------
 * 
 *  - Update Mode
 *  The update mode is how the sprite will be updated (and display the animation)
 *  It is relevant only on selection windows (such as the menu status window)
 *  On non-selection windows it makes no difference at all. It can be one of the
 *  following values:
 *    'always' : the sprite always updates.
 *    'active' : the sprite updates only when the window is active.
 *    'select' : the sprite updates only when the option with the same index
 *               is selected.
 *
 * ---------------
 * 
 *  - Option Index
 *  The option index is the index of the option that the sprite will be added
 *  for. Generally it's the same as the actor index, but it may be different
 *  depending on where the sprite is being drawn. It is relevant only on
 *  selection windows (such as the menu status window) On non-selection windows
 *  it makes no difference at all.
 *
 * ------------------------------------------------------------------------------
 * Example Codes:
 * ------------------------------------------------------------------------------
 * 
 *  var actor = $gameParty.members()[index];
 *  var mode  = 'active';
 *  var x = this.x + 64;
 *  var y = this.y + 96;
 *  this.drawBattlerSprite(actor, x, y, mode, index);
 *
 * ---------------
 *
 *  var actor = $gameParty.leader();
 *  var direction = 'down';
 *  var x = this.x + 64;
 *  var y = this.y + 96;
 *  this.drawCharsetSprite(actor, x, y, direction);
 *
 */
/*:ja
 * @plugindesc v1.00 SV戦闘キャラや歩行キャラのアニメーション画像をメニューウィンドウに追加できます
 * @author Victor Sant
 * 
 * @param = SV Sprite Display =
 * @text -- SV戦闘キャラ画像表示 --
 * @default ============================================
 * 
 * @param Sprite Offset X
 * @text SV戦闘キャラXオフセット
 * @type number
 * @desc 画像表示のオフセット位置Ｘ
 * デフォルト: 32 (数値)
 * @default 32
 * 
 * @param Sprite Offset Y
 * @text SV戦闘キャラYオフセット
 * @type number
 * @desc 画像表示のオフセット位置Y
 * デフォルト: 32 (数値)
 * @default 32
 * 
 * @param MenuStatus Sprite
 * @text SV戦闘キャラメニューステータス
 * @type select
 * @option 常時
 * @value always
 * @option 有効時
 * @value active
 * @option 選択時
 * @value select
 * @option なし
 * @value
 * @desc メニューステータス画面にアクターのSV戦闘キャラを表示
 * 常時:always / 有効時:active / 選択時:select / なし:無入力
 * @default always
 * 
 * @param SkillStatus Sprite
 * @text SV戦闘キャラスキルステータス
 * @type select
 * @option 常時
 * @value always
 * @option なし
 * @value
 * @desc スキルステータス画面にSV戦闘キャラを表示
 * 常時:always / なし:無入力
 * @default always
 * 
 * @param Status Sprite
 * @text SV戦闘キャラステータス
 * @type select
 * @option 常時
 * @value always
 * @option なし
 * @value
 * @desc ステータス画面にアクターのSV戦闘キャラを表示
 * 常時:always / なし:無入力
 * @default always
 * 
 * @param NameEdit Sprite
 * @text SV戦闘キャラ名前編集
 * @type select
 * @option 常時
 * @value always
 * @option なし
 * @value
 * @desc 名前変更ウィンドウにSV戦闘キャラを表示
 * 常時:always / なし:無入力
 * @default always
 * 
 * @param = Charset Display =
 * @text -- 歩行キャラ画像表示 --
 * @default ============================================
 * 
 * @param Charset Offset X
 * @text 歩行キャラ画像Xオフセット
 * @type number
 * @desc 歩行キャラ表示のオフセットX位置
 * デフォルト: 56 (数値)
 * @default 56
 * 
 * @param Charset Offset Y
 * @text 歩行キャラ画像Yオフセット
 * @type number
 * @desc 歩行キャラ表示のオフセットY位置
 * デフォルト: 56 (数値)
 * @default 56
 * 
 * @param MenuStatus Charset
 * @text 歩行キャラ画像メニューステータス
 * @type select
 * @option 常時
 * @value always
 * @option 有効時
 * @value active
 * @option 選択時
 * @value select
 * @option なし
 * @value
 * @desc メニューステータス画面にアクターの歩行キャラを表示
 * 常時:always / 有効時:active / 選択時:select / なし:無入力
 * @default @@
 * 
 * @param SkillStatus Charset
 * @text 歩行キャラ画像スキルステータス
 * @type select
 * @option 常時
 * @value always
 * @option なし
 * @value
 * @desc スキルステータス・ウィンドウにアクターの歩行キャラを表示
 * 常時:always / なし:無入力
 * @default @@
 * 
 * @param Status Charset
 * @text 歩行キャラ画像ステータス
 * @type select
 * @option 常時
 * @value always
 * @option なし
 * @value
 * @desc ステータスウィンドウにアクターの歩行キャラを表示
 * 常時:always / なし:無入力
 * @default @@
 * 
 * @param NameEdit Charset
 * @text 歩行キャラ画像名前編集
 * @type select
 * @option 常時
 * @value always
 * @option なし
 * @value
 * @desc 名前変更ウィンドウにアクターの歩行キャラを表示
 * 常時:always / なし:無入力
 * @default @@
 * 
 * @param == Face Display ==
 * @text -- 顔画像表示 --
 * @default ============================================
 * 
 * @param MenuStatus Face
 * @text 顔画像メニューステータス
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc メニューステータス画面に顔画像を表示
 * 表示:true / 非表示:false
 * @default true
 * 
 * @param SkillStatus Face
 * @text 顔画像スキルステータス
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc スキルステータス画面に顔画像を表示
 * 表示:true / 非表示:false
 * @default true
 * 
 * @param Status Face
 * @text 顔画像ステータス
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc ステータス画面に顔画像を表示
 * 表示:true / 非表示:false
 * @default true
 * 
 * @param NameEdit Face
 * @text 顔画像名前編集
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc 名前変更ウィンドウにアクターの顔画像を表示
 * 表示:true / 非表示:false
 * @default true
 * 
 * @help 
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 * 
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/sprite-in-windows/
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
 * アクターのメモタグ
 * ---------------------------------------------------------------------------
 * 
 *  <damaged window charset: 'filename', index, direction>
 * アクターが倒れた時の'damaged'ポーズを設定します。
 * 歩行キャラ表示にのみ関連しています。
 *      filename  : 歩行キャラのファイル名。引用符で囲う必要があります。
 *      index     : 歩行キャラのインデックス。 (0-7)
 *      direction : charset の向き。 (down / left / right / up)
 *        例 : <damaged charset: 'Damage1', 0, down>  // Harold
 *             <damaged charset: 'Damage1', 1, up>    // Therese
 *             <damaged charset: 'Damage1', 5, up>    // Marsha
 *             <damaged charset: 'Damage1', 3, right> // Lucius
 * ダメージポーズの歩行キャラは、一般的には、
 * 各シートに様々なキャラクターが一方向にそれぞれ付属しています。
 * 上の例では、
 * デフォルトの各キャラクターにダメージポーズ歩行キャラが付いています。
 * 
 * ---------------------------------------------------------------------------
 *  プラグインコマンド
 * ---------------------------------------------------------------------------
 * 
 * 数値の代わりにv[id]を使用して、
 * idが設定された変数から値を取得することができます。
 * 例えば、v[3]は変数ID3から値を取得します。
 * 
 * ---------------
 * 
 *  DamagedWindowCharset actor filename index direction
 * 歩行キャラモードを使用している場合、
 * アクターSV戦闘キャラのダメージを受けた歩行キャラを変更します。
 *      actor     : アクターID
 *      filename  : 歩行キャラのファイル名。引用符で囲う必要があります
 *      index     : 歩行キャラのインデックス (0-7)
 *      direction : 歩行キャラの向き (down / left / right / up)
 *        例 : DamagedWindowCharset 1 Damage1 0 down   // Harold
 *             DamagedWindowCharset 2 Damage1 1 up     // Therese
 *             DamagedWindowCharset 3 Damage1 5 up     // Marsha
 *             DamagedWindowCharset 4 Damage1 3 right  // Lucius
 * 
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 * 
 *  - 画像と歩行キャラの表示
 * 画像と歩行キャラの表示は、ステータス、メニューステータス、
 * スキルステータス、名前編集ウィンドウのみに影響を与えます。
 * 他のウィンドウは設定の影響を受けません。
 * 他のウィンドウにSV戦闘キャラの画像や歩行キャラを追加するには、
 * そのウィンドウに手動でコードを追加する必要があります。
 * スクリプトの知識が必要です。
 * 
 * 重要:
 * デフォルトのコードや自分のプラグインで作成したウィンドウに表示を追加する
 * サポートはしていますが、他の作者のプラグインで作成したウィンドウに
 * 画像を追加するコードについてはサポートしていません。
 * 自己責任でお願いします。
 * 
 * ---------------
 * 
 *  - ウィンドウに画像を追加
 * SV戦闘キャラの画像を追加するには、
 * 以下のコードをウィンドウに追加する必要があります。
 * コードはウィンドウの情報を表示する部分に配置する必要がありますが、
 * ウィンドウ毎に異なるので、
 * どこに配置しなければならないかは一概には言えません。
 * あなた自身で見つける必要があります。
 * 
 *  - SV戦闘キャラ画像用
 *    this.drawBattlerSprite(battler, x, y, mode, index);
 *       battler : Game_Battlerオブジェクト
 *       x : ウィンドウ上のX位置
 *       y : ウィンドウ上のY位置
 *       mode  : 画像更新モード ('always' / 'active' / 'select')
 *       index : オプションインデックス
 * 
 *  - 歩行キャラ画像用 (アクターのみ有効)
 *    this.drawCharsetSprite(battler, x, y, direction, mode, index);
 *       battler : Game_Battlerオブジェクト
 *       x : ウィンドウ上のX位置
 *       y : ウィンドウ上のY位置
 *       direction : 歩行キャラの向き ('down' / 'left' / 'right' / 'up')
 *       mode  : 画像更新モード ('always' / 'active' / 'select')
 *       index : オプションインデックス
 * 
 * ---------------
 * 
 *  - Update Mode
 * 更新モードは画像をどのように更新し、
 * アニメーションを表示するかを指定します。
 * 以下の値のいずれかを指定します。
 *    'always' : 常に更新
 *    'active' : ウィンドウが有効時のみ更新
 *    'select' : 同じインデックスのオプションが選択時のみ更新
 * 
 * ---------------
 * 
 *  - オプションインデックス
 * オプションインデックスは画像が追加されるオプションのインデックスです。
 * 一般的にはアクターインデックスと同じですが、
 * 画像が表示されている場所によっては異なる場合があります。
 * このインデックスは選択画面でのみ有効で、非選択画面では関係ありません。
 * 
 * ---------------------------------------------------------------------------
 * コード例
 * ---------------------------------------------------------------------------
 * 
 *  var actor = $gameParty.members()[index];
 *  var mode  = 'active';
 *  var x = this.x + 64;
 *  var y = this.y + 96;
 *  this.drawBattlerSprite(actor, x, y, mode, index);
 * 
 * ---------------
 * 
 *  var actor = $gameParty.leader();
 *  var direction = 'down';
 *  var x = this.x + 64;
 *  var y = this.y + 96;
 *  this.drawCharsetSprite(actor, x, y, direction);
 */

(function () {

	//=============================================================================
	// Parameters
	//=============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.SpriteInWindows = {};
		VictorEngine.Parameters.SpriteInWindows.SpriteX = Number(parameters["Sprite Offset X"]) || 0;
		VictorEngine.Parameters.SpriteInWindows.SpriteY = Number(parameters["Sprite Offset Y"]) || 0;
		VictorEngine.Parameters.SpriteInWindows.CharsetX = Number(parameters["Charset Offset X"]) || 0;
		VictorEngine.Parameters.SpriteInWindows.CharsetY = Number(parameters["Charset Offset Y"]) || 0;
		VictorEngine.Parameters.SpriteInWindows.MenuSprite = String(parameters["MenuStatus Sprite"]).trim();
		VictorEngine.Parameters.SpriteInWindows.MenuCharset = String(parameters["MenuStatus Charset"]).trim();
		VictorEngine.Parameters.SpriteInWindows.SkillSprite = String(parameters["SkillStatus Sprite"]).trim();
		VictorEngine.Parameters.SpriteInWindows.StatusSprite = String(parameters["Status Sprite"]).trim();
		VictorEngine.Parameters.SpriteInWindows.NameSprite = String(parameters["NameEdit Sprite"]).trim();
		VictorEngine.Parameters.SpriteInWindows.SkillCharset = String(parameters["SkillStatus Charset"]).trim();
		VictorEngine.Parameters.SpriteInWindows.StatusCharset = String(parameters["Status Charset"]).trim();
		VictorEngine.Parameters.SpriteInWindows.NameCharset = String(parameters["NameEdit Charset"]).trim();
		VictorEngine.Parameters.SpriteInWindows.MenuFace = eval(parameters["MenuStatus Face"]);
		VictorEngine.Parameters.SpriteInWindows.SkillFace = eval(parameters["SkillStatus Face"]);
		VictorEngine.Parameters.SpriteInWindows.StatusFace = eval(parameters["Status Face"]);
		VictorEngine.Parameters.SpriteInWindows.NameFace = eval(parameters["NameEdit Face"]);
	}

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.SpriteInWindows.loadNotetagsValues = VictorEngine.loadNotetagsValues;
	VictorEngine.loadNotetagsValues = function (data, index) {
		VictorEngine.SpriteInWindows.loadNotetagsValues.call(this, data, index);
		var list = ['actor'];
		if (this.objectSelection(index, list)) VictorEngine.SpriteInWindows.loadNotes(data);
	};

	VictorEngine.SpriteInWindows.loadNotes = function (data) {
		data.downedWindowCharset = data.downedWindowCharset || {};
		this.processNotes(data);
	};

	VictorEngine.SpriteInWindows.processNotes = function (data) {
		var match;
		var part1 = "('[^\']+'|\"[^\"]+\")";
		var part2 = '[ ]*,[ ]*(\\d+)[ ]*,[ ]*(down|left|right|up)';
		var regex = new RegExp('<damaged window charset[ ]*:[ ]*' + part1 + part2 + '[ ]*>', 'gi');
		while ((match = regex.exec(data.note)) !== null) { this.processDamaged(data, match) };
	};

	VictorEngine.SpriteInWindows.processDamaged = function (data, match) {
		var result = {};
		result.name = match[1].slice(1, -1);
		result.index = Number(match[2]);
		result.direction = String(match[3]);
		data.downedWindowCharset = result;
	};

	//=============================================================================
	// Game_Battler
	//=============================================================================

	Game_Battler.prototype.downedCharacterName = function () {
		return this._downedWindowCharset.name || '';
	};

	Game_Battler.prototype.downedCharacterIndex = function () {
		return this._downedWindowCharset.index || 0;
	};

	Game_Battler.prototype.downedDirection = function () {
		return this._downedWindowCharset.direction || '';
	};

	//=============================================================================
	// Game_Actor
	//=============================================================================

	VictorEngine.SpriteInWindows.setupGameActor = Game_Actor.prototype.setup;
	Game_Actor.prototype.setup = function (actorId) {
		VictorEngine.SpriteInWindows.setupGameActor.call(this, actorId);
		this._downedWindowCharset = this.actor().downedWindowCharset || {};
	};

	//=============================================================================
	// Game_Interpreter
	//=============================================================================

	VictorEngine.SpriteInWindows.pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		VictorEngine.SpriteInWindows.pluginCommand.call(this, command, args);
		if (command.toLowerCase() === 'damagedwindowcharset') {
			var v = $gameVariables._data;
			var actor = $gameActors.actor(Number(eval(args[0])) || 0);
			var name = String(args[1]) || '';
			var index = Number(eval(args[2]) - 1) || 0;
			var direction = String(args[3]) || '';
			if (actor) actor._downedWindowCharset = { name: name, index: index, direction: direction };
		}
	};

	//=============================================================================
	// Window_Base
	//=============================================================================

	VictorEngine.SpriteInWindows.initialize = Window_Base.prototype.initialize;
	Window_Base.prototype.initialize = function (x, y, width, height) {
		this._battlerSprites = [];
		this._charsetSprites = []
		VictorEngine.SpriteInWindows.initialize.call(this, x, y, width, height);
	};

	Window_Base.prototype.drawBattlerSprite = function (battler, x, y, mode, index) {
		var index = index || 0;
		var mode = mode || 'always';
		var battlerSprite = this._battlerSprites[index];
		if (!battlerSprite) {
			var sprite = new Sprite_WindowBattler(battler, index, mode);
			this._battlerSprites[index] = sprite;
			this.addChild(sprite);
			sprite.setWindow(this);
			sprite.setBattler(battler, x, y);
		} else if (battlerSprite) {
			battlerSprite.setBattler(battler, x, y);
		}
	};

	Window_Base.prototype.drawCharsetSprite = function (battler, x, y, direction, mode, index) {
		var index = index || 0;
		var mode = mode || 'always';
		var charsetSprite = this._charsetSprites[index];
		if (!charsetSprite) {
			var sprite = new Sprite_WindowCharset(battler, index, mode);
			this._charsetSprites[index] = sprite;
			this.addChild(sprite);
			sprite.setWindow(this);
			sprite.setCharacter(battler, x, y);
			sprite.setDirection(direction);
		} else if (charsetSprite) {
			charsetSprite.setCharacter(battler, x, y);
			charsetSprite.setDirection(direction);
		}
	};

	Window_Base.prototype.isSelected = function (index) {
		return true;
	};

	//=============================================================================
	// Window_Selectable
	//=============================================================================

	VictorEngine.SpriteInWindows.drawAllItems = Window_Selectable.prototype.drawAllItems;
	Window_Selectable.prototype.drawAllItems = function () {
		var top = this.topIndex();
		var max = this.maxItems();
		var page = this.maxPageItems() + top;
		this._battlerSprites.forEach(function (sprite, index) {
			if (sprite) sprite.visible = index >= top && index < page && index < max;
		});
		this._charsetSprites.forEach(function (sprite, index) {
			if (sprite) sprite.visible = index >= top && index < page && index < max;
		});
		VictorEngine.SpriteInWindows.drawAllItems.call(this);
	};

	Window_Selectable.prototype.isSelected = function (index) {
		return this.index() === index || this.cursorAll();
	};

	//=============================================================================
	// Window_MenuStatus
	//=============================================================================

	Window_MenuStatus.prototype.drawActorFace = function (actor, x, y, width, height) {
		var parameter = VictorEngine.Parameters.SpriteInWindows;
		if (parameter.MenuSprite) {
			var index = $gameParty.members().indexOf(actor);
			this.drawBattlerSprite(actor, x + parameter.SpriteX, y + parameter.SpriteY, parameter.MenuSprite, index);
		}
		if (parameter.MenuCharset) {
			var index = $gameParty.members().indexOf(actor);
			this.drawCharsetSprite(actor, x + parameter.CharsetX, y + parameter.CharsetY, 'down', parameter.MenuCharset, index);
		}
		if (parameter.MenuFace) {
			Window_Base.prototype.drawActorFace.call(this, actor, x, y, width, height);
		}
	};

	//=============================================================================
	// Window_SkillStatus
	//=============================================================================

	Window_SkillStatus.prototype.drawActorFace = function (actor, x, y, width, height) {
		var parameter = VictorEngine.Parameters.SpriteInWindows;
		if (parameter.SkillSprite) {
			var index = $gameParty.members().indexOf(actor);
			this.drawBattlerSprite(actor, x + parameter.SpriteX, y + parameter.SpriteY);
		}
		if (parameter.SkillCharset) {
			var index = $gameParty.members().indexOf(actor);
			this.drawCharsetSprite(actor, x + parameter.CharsetX, y + parameter.CharsetY, 'down');
		}
		if (parameter.SkillFace) {
			Window_Base.prototype.drawActorFace.call(this, actor, x, y, width, height);
		}
	};

	//=============================================================================
	// Window_Status
	//=============================================================================

	Window_Status.prototype.drawActorFace = function (actor, x, y, width, height) {
		var parameter = VictorEngine.Parameters.SpriteInWindows;
		if (parameter.StatusSprite) {
			var index = $gameParty.members().indexOf(actor);
			this.drawBattlerSprite(actor, x + parameter.SpriteX, y + parameter.SpriteY);
		}
		if (parameter.StatusCharset) {
			var index = $gameParty.members().indexOf(actor);
			this.drawCharsetSprite(actor, x + parameter.CharsetX, y + parameter.CharsetY, 'down');
		}
		if (parameter.StatusFace) {
			Window_Base.prototype.drawActorFace.call(this, actor, x, y, width, height);
		}
	};

	//=============================================================================
	// Window_NameEdit
	//=============================================================================

	Window_NameEdit.prototype.drawActorFace = function (actor, x, y, width, height) {
		var parameter = VictorEngine.Parameters.SpriteInWindows;
		if (parameter.NameSprite) {
			var index = $gameParty.members().indexOf(actor);
			this.drawBattlerSprite(actor, x + parameter.SpriteX, y + parameter.SpriteY);
		}
		if (parameter.NameCharset) {
			var index = $gameParty.members().indexOf(actor);
			this.drawCharsetSprite(actor, x + parameter.CharsetX, y + parameter.CharsetY, 'down');
		}
		if (parameter.NameFace) {
			Window_Base.prototype.drawActorFace.call(this, actor, x, y, width, height);
		}
	};

})();

//=============================================================================
// Sprite_WindowBattler
//=============================================================================

function Sprite_WindowBattler() {
	this.initialize.apply(this, arguments);
}

Sprite_WindowBattler.prototype = Object.create(Sprite.prototype);
Sprite_WindowBattler.prototype.constructor = Sprite_WindowBattler;

(function () {

	Sprite_WindowBattler.prototype.initialize = function (battler, index, mode) {
		Sprite.prototype.initialize.call(this);
		this._mode = mode;
		this._index = index;
		this.createMainSprite(battler);
	};

	Sprite_WindowBattler.prototype.createMainSprite = function (battler) {
		this._mainSprite = this.setupBattleSprite(battler);
		this.addChild(this._mainSprite);
	};

	Sprite_WindowBattler.prototype.setBattler = function (battler, x, y) {
		var copy = JsonEx.makeDeepCopy(battler);
		copy._actionState = 'undecided';
		this._mainSprite.setBattler(copy);
		this._mainSprite.setHome(0, 0);
		this._mainSprite._offsetX = 0;
		this._mainSprite._offsetY = 0;
		this._mainSprite._movementDuration = 0
		this._mainSprite.refreshMotion();
		this._spriteX = x + 98;
		this._spriteY = y + 124;
		this._mainSprite.update();
		this.update();
	};

	Sprite_WindowBattler.prototype.setWindow = function (window) {
		this._window = window;
	};

	Sprite_WindowBattler.prototype.update = function (battler) {
		var window = this._window;
		if ((this._mode === 'select' && window.isSelected(this._index)) ||
			(this._mode === 'active' && window.active) ||
			(this._mode === 'always')) {
			this._mainSprite.update();
		} else {
			this._mainSprite._pattern = 0;
			this._mainSprite.update();
		}
		this.x = this._spriteX;
		this.y = this._spriteY;
	};

	Sprite_WindowBattler.prototype.setupBattleSprite = function (battler) {
		if (battler.isEnemy()) {
			return this.setupEnemySprite(battler);
		} else {
			return this.setupActorSprite(battler);
		}
	};

	Sprite_WindowBattler.prototype.setupActorSprite = function (battler) {
		var type;
		var imported = Imported['VE - Battler Graphic Setup'];
		if (imported) type = VictorEngine.SpriteInWindows.actorSprite;
		if (imported && this.isAnimatedBattler(battler)) type = 'animated';
		if (imported && this.isStaticBattler(battler)) type = 'static';
		if (imported && this.isCharsetBattler(battler)) type = 'charset';
		switch (type) {
			case 'static':
				return new Sprite_StaticActor(battler);
			case 'charset':
				return new Sprite_CharsetActor(battler);
			default:
				return new Sprite_Actor(battler);
		};
	};

	Sprite_WindowBattler.prototype.setupEnemySprite = function (battler) {
		var type;
		var imported = Imported['VE - Battler Graphic Setup']
		if (imported) type = VictorEngine.SpriteInWindows.enemySprite;
		if (imported && this.isAnimatedBattler(battler)) type = 'animated';
		if (imported && this.isStaticBattler(battler)) type = 'static';
		if (imported && this.isCharsetBattler(battler)) type = 'charset';
		switch (type) {
			case 'charset':
				return new Sprite_CharsetEnemy(battler);
			case 'animated':
				return new Sprite_AnimatedEnemy(battler);
			default:
				return new Sprite_Enemy(battler);
		};
	};

	Sprite_WindowBattler.prototype.isCharsetBattler = function (battler, type) {
		return ImageManager.isCharsetBattler(battler ? battler.battlerName() : '', type)
	};

	Sprite_WindowBattler.prototype.isStaticBattler = function (battler, type) {
		return ImageManager.isStaticBattler(battler ? battler.battlerName() : '', type)
	};

	Sprite_WindowBattler.prototype.isAnimatedBattler = function (battler, type) {
		return ImageManager.isAnimatedBattler(battler ? battler.battlerName() : '', type)
	};

})();

//=============================================================================
// Sprite_WindowCharset
//=============================================================================

function Sprite_WindowCharset() {
	this.initialize.apply(this, arguments);
}

Sprite_WindowCharset.prototype = Object.create(Sprite.prototype);
Sprite_WindowCharset.prototype.constructor = Sprite_WindowCharset;

(function () {

	Sprite_WindowCharset.prototype.initialize = function (battler, index, mode) {
		Sprite.prototype.initialize.call(this);
		this._mode = mode;
		this._index = index;
		this.createMainSprite(battler);
	};

	Sprite_WindowCharset.prototype.createMainSprite = function (battler) {
		this._character = new Game_Character();
		this._mainSprite = new Sprite_Character(this._character);
		this.addChild(this._mainSprite);
	};

	Sprite_WindowCharset.prototype.setCharacter = function (battler, x, y) {
		this._isDisabled = battler.isDeathStateAffected();
		if (this._isDisabled && battler.downedCharacterName()) {
			var characterName = battler.downedCharacterName();
			var characterIndex = battler.downedCharacterIndex();
			this._downedDirection = battler.downedDirection();
		} else {
			var characterName = battler.characterName();
			var characterIndex = battler.characterIndex();
			this._downedDirection = null;
		}
		this._character.setImage(characterName, characterIndex);
		this._character.setStepAnime(battler.canMove());
		this._spriteX = x + 64;
		this._spriteY = y + 64;
		this._mainSprite.update();
		this.update();
	};

	Sprite_WindowCharset.prototype.setWindow = function (window) {
		this._window = window;
	};

	Sprite_WindowCharset.prototype.update = function (battler) {
		var window = this._window;
		if ((this._mode === 'select' && window.isSelected(this._index)) ||
			(this._mode === 'active' && window.active) ||
			(this._mode === 'always')) {
			this._character.update();
			this._mainSprite.update();
		} else {
			this._character.straighten();
			this._mainSprite.update();
		}
		this.x = this._spriteX;
		this.y = this._spriteY;
	};

	Sprite_WindowCharset.prototype.setDirection = function (direction) {
		if (this._downedDirection) direction = this._downedDirection;
		switch (direction.toLowerCase()) {
			case 'down':
				this._character.setDirection(2);
				break;
			case 'left':
				this._character.setDirection(4);
				break;
			case 'right':
				this._character.setDirection(6);
				break;
			case 'up':
				this._character.setDirection(8);
		}
	};

})();