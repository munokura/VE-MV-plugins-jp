/*
 * ==============================================================================
 * ** Victor Engine MV - Arrow Cursor
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.04.10 > First release.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Arrow Cursor'] = '1.00';

var VictorEngine = VictorEngine || {};
VictorEngine.ArrowCursor = VictorEngine.ArrowCursor || {};

(function () {

	VictorEngine.ArrowCursor.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.ArrowCursor.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Arrow Cursor', 'VE - Basic Module', '1.12');
	};

	VictorEngine.ArrowCursor.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.ArrowCursor.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.00 - Adds a graphic for the selection cursor.
 * @author Victor Sant
 *
 * @param == Default Setup ==
 * @default ==============================================
 *
 * @param Default Cursor Image
 * @desc Cusor graphic image.
 * Filename (leave blank for no cursor image)
 * @default @@
 *
 * @param Cursor Frames
 * @desc Number of frames of the cursor.
 * Default: 1 (Numeric)
 * @default 1
 *
 * @param Frame Speed
 * @desc Update speed for the cursor frame.
 * Default: 8 (Numeric)
 * @default 8
 *
 * @param Cursor Rect
 * @desc Display the RPG Maker default cursor rectangle.
 * true - ON     false - OFF
 * @default true
 *
 * @param Behind Text
 * @desc Cursor is displayed bellow the text.
 * true - ON     false - OFF
 * @default false
 *
 * @param Centralize Cursor
 * @desc Centralize the cursor image vertically.
 * true - ON     false - OFF
 * @default true
 *
 * @param Cursor Offset X
 * @desc Cursor image position offset X
 * Default: 0 (Numeric)
 * @default 0
 *
 * @param Cursor Offset Y
 * @desc Cursor image position offset Y
 * Default: 0 (Numeric)
 * @default 0
 *
 * @param Content Offset
 * @desc Descriptigin
 * Default: 0 (Numeric)
 * @default 0
 *
 * @param Loop Animation
 * @desc Display a looping animation for the cursor.
 * animation Id. Requires the plugin 'Loop Animation'
 * @default 0
 *
 * @param == Cursor Images ==
 * @default ==============================================
 *
 * @param Actor Command Image
 * @desc Window Actor Command cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Battle Actor Image
 * @desc Window Battle Actor cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Battle Enemy Image
 * @desc Window Battle Enemy cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Battle Item Image
 * @desc Window Battle Item cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Battle Skill Image
 * @desc Window Battle Skill cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Battle Status Image
 * @desc Window Battle Status cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Choice List Image
 * @desc Window Choice List Cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Command Image
 * @desc Window Command cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Equip Command Image
 * @desc Window Equip Command cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Equip Item Image
 * @desc Window Equip Item cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Equip Slot Image
 * @desc Window Equip Slot cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Event Item Image
 * @desc Window Event Item cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Game End Image
 * @desc Window Game End cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Horzontal Command Image
 * @desc Window Horzontal Command cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Item Category Image
 * @desc Window Item Category cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Item List Image
 * @desc Window Item List cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Menu Actor Image
 * @desc Window Menu Actor cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Menu Command Image
 * @desc Window Menu Command cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Menu Status Image
 * @desc Window Menu Status cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Name Input Image
 * @desc Window Name Input cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Number Input Image
 * @desc Window Number Input cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Options Image
 * @desc Window Options cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Party Command Image
 * @desc Window Party Command cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Savefile List Image
 * @desc Window Savefile List cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Shop Buy Image
 * @desc Window Shop Buy cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Shop Command Image
 * @desc Window Shop Command cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Shop Number Image
 * @desc Window Shop Number cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Shop Sell Image
 * @desc Window Shop Sell cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Skill List Image
 * @desc Window Skill List cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Skill Type Image
 * @desc Window Skill Type cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @param Title Command Image
 * @desc Window Title Command cusor graphic image.
 * Filename (leave blank to use default cursor image)
 * @default @@
 *
 * @help 
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 *
 *  - Cursor Images
 *  The Plugin Parameter 'Default Cursor Image' set the default filename for the
 *  cursor, this file will be used for each window that don't have it's own image
 *  defined on the 'Cursor Images' plugin parameters.
 *  All images must be placed on the folder 'img/system/'. The frames' setup must
 *  be the same for every window, although the image size can be different.
 *
 * ---------------
 *
 *  - Cursor Animation
 *  The Plugin Parameter 'Loop Animation' allows you to use a looping animation
 *  together (or in place) of the image cursor. Leave the value 0 to not show
 *  an animation. Requires the plugin 'Loop Animation'.
 * 
 * ------------------------------------------------------------------------------
 */
/*:ja
 * @plugindesc v1.00 選択カーソルに画像を追加します
 * @author Victor Sant
 *
 * @param == Default Setup ==
 * @text -- デフォルト設定 --
 * @default ==============================================
 *
 * @param Default Cursor Image
 * @text デフォルトのカーソル画像
 * @desc カーソル画像
 * ファイル名 (指定しない場合、無入力)
 * @default @@
 *
 * @param Cursor Frames
 * @text カーソルフレーム
 * @desc カーソルのフレーム数
 * デフォルト: 1 (数値)
 * @default 1
 *
 * @param Frame Speed
 * @text フレーム速度
 * @desc カーソルフレームの更新速度
 * デフォルト: 8 (数値)
 * @default 8
 *
 * @param Cursor Rect
 * @text デフォルトカーソル
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc デフォルトのカーソル
 * 有効:true / 無効:false
 * @default true
 *
 * @param Behind Text
 * @text テキスト下層に表示
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc カーソルをテキストの下層に表示
 * 有効:true / 無効:false
 * @default false
 *
 * @param Centralize Cursor
 * @text カーソルの中央寄せ
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc カーソル画像を垂直方向に中央寄せします
 * 有効:true / 無効:false
 * @default true
 *
 * @param Cursor Offset X
 * @text カーソルオフセットX
 * @desc カーソル画像の位置オフセットX
 * デフォルト: 0 (数値)
 * @default 0
 *
 * @param Cursor Offset Y
 * @text カーソルオフセットY
 * @desc カーソル画像位置オフセットY
 * デフォルト: 0 (数値)
 * @default 0
 *
 * @param Content Offset
 * @text コンテンツオフセット
 * @desc 説明
 * デフォルト: 0 (数値)
 * @default 0
 *
 * @param Loop Animation
 * @text ループアニメーション
 * @desc カーソルのループするアニメーションを表示します
 * アニメーションIDを指定。要'Loop Animation'プラグイン
 * @default 0
 *
 * @param == Cursor Images ==
 * @text -- カーソル画像 --
 * @default ==============================================
 *
 * @param Actor Command Image
 * @text アクターコマンド画像
 * @desc アクターコマンドカーソルの画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Battle Actor Image
 * @text 戦闘アクター画像
 * @desc 戦闘アクターカーソルの画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Battle Enemy Image
 * @text 戦闘敵キャラ画像
 * @desc 戦闘敵キャラカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Battle Item Image
 * @text 戦闘アイテム画像
 * @desc 戦闘アイテムカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Battle Skill Image
 * @text 戦闘スキル画像
 * @desc 戦闘スキルカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Battle Status Image
 * @text 戦闘ステータス画像
 * @desc 戦闘ステータスカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Choice List Image
 * @text 選択肢リスト画像
 * @desc 選択リストカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Command Image
 * @text コマンド画像
 * @desc コマンドカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Equip Command Image
 * @text 装備コマンド画像
 * @desc 装備コマンドカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Equip Item Image
 * @text 装備品画像
 * @desc アイテム装備カーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Equip Slot Image
 * @text 装備スロット画像
 * @desc 装備スロットカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Event Item Image
 * @text イベントアイテム画像
 * @desc イベントアイテムカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Game End Image
 * @text ゲーム終了画像
 * @desc ゲーム終了のカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Horzontal Command Image
 * @text 横型コマンド画像
 * @desc 横型コマンドカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Item Category Image
 * @text アイテムカテゴリ画像
 * @desc アイテムカテゴリカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Item List Image
 * @text アイテム一覧画像
 * @desc アイテムリストカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Menu Actor Image
 * @text メニューアクター画像
 * @desc メニューアクターカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Menu Command Image
 * @text メニューコマンド画像
 * @desc メニューコマンドカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Menu Status Image
 * @text メニューステータス画像
 * @desc メニューステータスカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Name Input Image
 * @text 名前入力画像
 * @desc 名前入力カーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Number Input Image
 * @text 番号入力画像
 * @desc 番号入力カーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Options Image
 * @text オプション画像
 * @desc オプション入力カーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Party Command Image
 * @text パーティコマンド画像
 * @desc パーティコマンドカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Savefile List Image
 * @text 保存ファイル一覧画像
 * @desc セーブリストカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Shop Buy Image
 * @text ショップ購入画像
 * @desc ショップ購入カーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Shop Command Image
 * @text ショップコマンド画像
 * @desc ショップコマンドカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Shop Number Image
 * @text ショップ数量画像
 * @desc ショップ数量カーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Shop Sell Image
 * @text ショップ販売画像
 * @desc ショップ販売カーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Skill List Image
 * @text スキル一覧画像
 * @desc スキルリストカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Skill Type Image
 * @text スキルタイプ画像
 * @desc スキルタイプカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @param Title Command Image
 * @text タイトルコマンド画像
 * @desc タイトルコマンドカーソル画像
 * ファイル名 (デフォルト使用の場合、無入力)
 * @default @@
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/arrow-cursor/
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
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 *  - カーソル画像
 * プラグインパラメータ'Default Cursor Image'は
 * カーソルのデフォルトのファイル名を設定します。
 * 全ての画像は'img/system/'フォルダに配置されなければなりません。
 * フレームの設定は全てのウィンドウで同じでなければなりませんが、
 * 画像のサイズは異なる場合があります。
 *
 * 各プラグインパラメーターのファイル名には拡張子を入力しないでください。
 *
 * ---------------
 *
 *  - カーソルのアニメーション
 * プラグインパラメータ'Loop Animation'は、
 * 画像カーソルと一緒に(/代わりに)ループするアニメーションを使用できます。
 * 値を0のままにしておくとアニメーションを表示しません。
 * 'Loop Animation'プラグインが必要です。
 *
 * ---------------------------------------------------------------------------
 */

(function () {

	//=============================================================================
	// Parameters
	//=============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.ArrowCursor = {};
		VictorEngine.Parameters.ArrowCursor.DefaultImage = String(parameters["Default Cursor Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.ActorCommand = String(parameters["Actor Command Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.BattleActor = String(parameters["Battle Actor Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.BattleEnemy = String(parameters["Battle Enemy Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.BattleItem = String(parameters["Battle Item Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.BattleSkill = String(parameters["Battle Skill Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.BattleStatus = String(parameters["Battle Status Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.ChoiceList = String(parameters["Choice List Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.Command = String(parameters["Command Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.EquipCommand = String(parameters["Equip Command Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.EquipItem = String(parameters["Equip Item Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.EquipSlot = String(parameters["Equip Slot Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.EventItem = String(parameters["Event Item Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.GameEnd = String(parameters["Game End Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.HorzCommand = String(parameters["Horzontal Command Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.ItemCategory = String(parameters["Item Category Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.ItemList = String(parameters["Item List Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.MenuActor = String(parameters["Menu Actor Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.MenuCommand = String(parameters["Menu Command Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.MenuStatus = String(parameters["Menu Status Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.NameInput = String(parameters["Name Input Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.NumberInput = String(parameters["Number Input Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.Options = String(parameters["Options Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.PartyCommand = String(parameters["Party Command Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.SavefileList = String(parameters["Savefile List Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.ShopBuy = String(parameters["Shop Buy Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.ShopCommand = String(parameters["Shop Command Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.ShopNumber = String(parameters["Shop Number Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.ShopSell = String(parameters["Shop Sell Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.SkillList = String(parameters["Skill List Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.SkillType = String(parameters["Skill Type Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.TitleCommand = String(parameters["Title Command Image"]).trim();
		VictorEngine.Parameters.ArrowCursor.Frames = Number(parameters["Cursor Frames"]) || 1;
		VictorEngine.Parameters.ArrowCursor.Speed = Number(parameters["Frame Speed"]) || 1;
		VictorEngine.Parameters.ArrowCursor.Content = Number(parameters["Content Offset"]) || 0;
		VictorEngine.Parameters.ArrowCursor.OffsetX = Number(parameters["Cursor Offset X"]) || 0;
		VictorEngine.Parameters.ArrowCursor.OffsetY = Number(parameters["Cursor Offset Y"]) || 0;
		VictorEngine.Parameters.ArrowCursor.Animation = Number(parameters["Loop Animation"]) || 0;
		VictorEngine.Parameters.ArrowCursor.CursorRect = eval(parameters["Cursor Rect"]);
		VictorEngine.Parameters.ArrowCursor.BehindText = eval(parameters["Behind Text"]);
		VictorEngine.Parameters.ArrowCursor.Centralize = eval(parameters["Centralize Cursor"]);
	}

	//=============================================================================
	// Window_Selectable
	//=============================================================================

	VictorEngine.ArrowCursor.initialize = Window_Selectable.prototype.initialize;
	Window_Selectable.prototype.initialize = function (x, y, width, height) {
		VictorEngine.ArrowCursor.initialize.call(this, x, y, width, height);
		this.setupArrowCursor();
		this.createArrowCursor();
	};

	VictorEngine.ArrowCursor.select = Window_Selectable.prototype.select;
	Window_Selectable.prototype.select = function (index) {
		var lastIndex = this.index();
		VictorEngine.ArrowCursor.select.call(this, index)
		if (this.index() !== lastIndex) this.refresh();
	};

	VictorEngine.ArrowCursor.updateCursor = Window_Selectable.prototype.updateCursor;
	Window_Selectable.prototype.updateCursor = function () {
		if (this._cursorAll && !this._arrowCursorAll) {
			this.createAllArrowCursor();
		} else if (!this._cursorAll && this._arrowCursorAll) {
			this.removeAllArrowCursor();
		}
		VictorEngine.ArrowCursor.updateCursor.call(this);
		this.updateArrowCursor();
	};

	VictorEngine.ArrowCursor.itemRect = Window_Selectable.prototype.itemRect;
	Window_Selectable.prototype.itemRect = function (index) {
		var rect = VictorEngine.ArrowCursor.itemRect.call(this, index);
		rect.x += this._arrowCursorContent;
		rect.width -= this._arrowCursorContent;
		return rect;
	};

	VictorEngine.ArrowCursor._updateCursor = Window_Selectable.prototype._updateCursor;
	Window_Selectable.prototype._updateCursor = function () {
		VictorEngine.ArrowCursor._updateCursor.call(this);
		if (!this._arrowCursorCursorRect) this._windowCursorSprite.visible = false;
	};

	Window_Selectable.prototype.setupArrowCursor = function () {
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.DefaultImage;
		this._arrowCursorFrames = VictorEngine.Parameters.ArrowCursor.Frames;
		this._arrowCursorSpeed = VictorEngine.Parameters.ArrowCursor.Speed;
		this._arrowCursorContent = VictorEngine.Parameters.ArrowCursor.Content;
		this._arrowCursorOffsetX = VictorEngine.Parameters.ArrowCursor.OffsetX;
		this._arrowCursorOffsetY = VictorEngine.Parameters.ArrowCursor.OffsetY;
		this._arrowCursorAnimation = VictorEngine.Parameters.ArrowCursor.Animation;
		this._arrowCursorCursorRect = VictorEngine.Parameters.ArrowCursor.CursorRect;
		this._arrowCursorBehindText = VictorEngine.Parameters.ArrowCursor.BehindText;
		this._arrowCursorCentralize = VictorEngine.Parameters.ArrowCursor.Centralize;
	};

	Window_Selectable.prototype.createArrowCursor = function () {
		this._arrowCursor = new Sprite_ArrowCursor();
		this._arrowCursor.setWindow(this);
		if (this._arrowCursorBehindText) {
			this.addChildToBack(this._arrowCursor);
		} else {
			this.addChild(this._arrowCursor);
		}
	};

	Window_Selectable.prototype.createAllArrowCursor = function () {
		this._arrowCursorAll = [];
		for (var i = 0; i < this.maxItems(); i++) {
			var cursor = new Sprite_ArrowCursor();
			cursor.setWindow(this, i + 1);
			this._arrowCursorAll.push(cursor)
			if (this._arrowCursorBehindText) {
				this.addChildToBack(cursor);
			} else {
				this.addChild(cursor);
			}
		}
	};

	Window_Selectable.prototype.updateArrowCursor = function () {
		if (this._arrowCursor) this._arrowCursor.update();
		if (this._arrowCursorAll) this._arrowCursorAll.forEach(function (cursor) { cursor.update() });
	};

	Window_Selectable.prototype.removeAllArrowCursor = function () {
		for (var i = 0; i < this._arrowCursorAll.length; i++) {
			this._arrowCursorAll[i].removeLoopAnimation();
			this.removeChild(this._arrowCursorAll[i]);
		};
		this._arrowCursorAll = null;
	};

	Window_Selectable.prototype.arrowCursorRect = function (index) {
		var rect = VictorEngine.ArrowCursor.itemRect.call(this, index);
		rect.y += this.standardPadding();
		return rect;
	};

	//=============================================================================
	// Window_ActorCommand
	//=============================================================================

	Window_ActorCommand.prototype.setupArrowCursor = function () {
		Window_Command.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.ActorCommand || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_BattleActor
	//=============================================================================

	Window_BattleActor.prototype.setupArrowCursor = function () {
		Window_BattleStatus.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.BattleActor || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_BattleEnemy
	//=============================================================================

	Window_BattleEnemy.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.BattleEnemy || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_BattleItem
	//=============================================================================

	Window_BattleItem.prototype.setupArrowCursor = function () {
		Window_ItemList.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.BattleItem || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_BattleSkill
	//=============================================================================

	Window_BattleSkill.prototype.setupArrowCursor = function () {
		Window_SkillList.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.BattleSkill || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_BattleStatus
	//=============================================================================

	Window_BattleStatus.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.BattleStatus || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_ChoiceList
	//=============================================================================

	VictorEngine.ArrowCursor.windowWidth = Window_ChoiceList.prototype.windowWidth;
	Window_ChoiceList.prototype.windowWidth = function () {
		var width = VictorEngine.ArrowCursor.windowWidth.call(this) + (this._arrowCursorContent || 0);
		return Math.min(width, Graphics.boxWidth);
	};

	Window_ChoiceList.prototype.setupArrowCursor = function () {
		Window_Command.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.ChoiceList || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_Command
	//=============================================================================

	Window_Command.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.Command || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_EquipCommand
	//=============================================================================

	Window_EquipCommand.prototype.setupArrowCursor = function () {
		Window_HorzCommand.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.EquipCommand || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_EquipItem
	//=============================================================================

	Window_EquipItem.prototype.setupArrowCursor = function () {
		Window_ItemList.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.EquipItem || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_EquipItem
	//=============================================================================

	Window_EquipSlot.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.EquipSlot || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_EventItem
	//=============================================================================

	Window_EventItem.prototype.setupArrowCursor = function () {
		Window_ItemList.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.EventItem || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_GameEnd
	//=============================================================================

	Window_GameEnd.prototype.setupArrowCursor = function () {
		Window_Command.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.GameEnd || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_HorzCommand
	//=============================================================================

	Window_HorzCommand.prototype.setupArrowCursor = function () {
		Window_Command.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.HorzCommand || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_ItemCategory
	//=============================================================================

	Window_ItemCategory.prototype.setupArrowCursor = function () {
		Window_HorzCommand.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.ItemCategory || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_ItemList
	//=============================================================================

	Window_ItemList.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.ItemList || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_MenuActor
	//=============================================================================

	Window_MenuActor.prototype.setupArrowCursor = function () {
		Window_MenuStatus.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.MenuActor || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_MenuCommand
	//=============================================================================

	Window_MenuCommand.prototype.setupArrowCursor = function () {
		Window_Command.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.MenuCommand || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_MenuStatus
	//=============================================================================

	Window_MenuStatus.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.MenuStatus || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_NameInput
	//=============================================================================

	Window_NameInput.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.NameInput || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_NumberInput
	//=============================================================================

	Window_NumberInput.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.NumberInput || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_Options
	//=============================================================================

	Window_Options.prototype.setupArrowCursor = function () {
		Window_Command.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.Options || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_PartyCommand
	//=============================================================================

	Window_PartyCommand.prototype.setupArrowCursor = function () {
		Window_Command.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.PartyCommand || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_SavefileList
	//=============================================================================

	Window_SavefileList.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.SavefileList || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_ShopBuy
	//=============================================================================

	Window_ShopBuy.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.ShopBuy || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_ShopCommand
	//=============================================================================

	Window_ShopCommand.prototype.setupArrowCursor = function () {
		Window_HorzCommand.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.ShopCommand || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_ShopNumber
	//=============================================================================

	Window_ShopNumber.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.ShopNumber || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_ShopSell
	//=============================================================================

	Window_ShopSell.prototype.setupArrowCursor = function () {
		Window_ItemList.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.ShopSell || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_SkillList
	//=============================================================================

	Window_SkillList.prototype.setupArrowCursor = function () {
		Window_Selectable.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.SkillList || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_SkillType
	//=============================================================================

	Window_SkillType.prototype.setupArrowCursor = function () {
		Window_Command.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.SkillType || this._arrowCursorImage;
	};

	//=============================================================================
	// Window_TitleCommand
	//=============================================================================

	Window_TitleCommand.prototype.setupArrowCursor = function () {
		Window_Command.prototype.setupArrowCursor.call(this)
		this._arrowCursorImage = VictorEngine.Parameters.ArrowCursor.TitleCommand || this._arrowCursorImage;
	};

})();

function Sprite_ArrowCursor() {
	this.initialize.apply(this, arguments);
}

Sprite_ArrowCursor.prototype = Object.create(Sprite_Base.prototype);
Sprite_ArrowCursor.prototype.constructor = Sprite_ArrowCursor;

(function () {

	Sprite_ArrowCursor.prototype.initialize = function () {
		Sprite_Base.prototype.initialize.call(this);
		this._count = 0;
		this._pattern = 0;
		this.anchor.y = 0.5;
		this._animationId = 0;
	};

	Sprite_ArrowCursor.prototype.setWindow = function (window, index) {
		this._window = window;
		this._cursorIndex = index;
	};

	Sprite_ArrowCursor.prototype.update = function () {
		Sprite_Base.prototype.update.call(this);
		this.updateBitmap();
		this.updateFrame();
		this.updatePosition();
	};

	Sprite_ArrowCursor.prototype.updateBitmap = function () {
		var window = this._window;
		if (!this.bitmap && window._arrowCursorImage) {
			this.bitmap = ImageManager.loadSystem(window._arrowCursorImage);
			this.bitmap.addLoadListener(this.updateFrame.bind(this));
		}
		var anim = window._arrowCursorAnimation;
		if (Imported['VE - Loop Animation'] && this.opacity && window.isCursorVisible() && window.isOpen() && this._animationId !== anim) {
			this._animationId = anim;
			this.addLoopAnimation({ id: this._animationId, type: 'cursor', loop: 5 });
		}
	};

	Sprite_ArrowCursor.prototype.updateFrame = function () {
		var window = this._window;
		if (this.bitmap) {
			var frames = window._arrowCursorFrames;
			var speed = window._arrowCursorSpeed;
			var width = this.bitmap.width / frames;
			var height = this.bitmap.height;
			var x = width * this._pattern;
			this.setFrame(x, 0, width, height);
			if (window.active && ++this._count >= speed) {
				this._pattern = (this._pattern + 1) % frames;
				this._count = 0;
			};
		}
	};

	Sprite_ArrowCursor.prototype.updatePosition = function () {
		var window = this._window;
		if (window.isCursorVisible() && window.isOpen() && !window._cursorAll) {
			this.updateCursorPosition(window.index());
		} else if (window.isCursorVisible() && window.isOpen() && this._cursorIndex) {
			this.updateCursorPosition(this._cursorIndex - 1);
		} else {
			this.opacity = 0;
			this.visible = false;
			this.removeLoopAnimation();
		}
	};

	Sprite_ArrowCursor.prototype.updateCursorPosition = function (index) {
		var window = this._window;
		var rect = window.arrowCursorRect(index);
		var height = window._arrowCursorCentralize ? rect.height / 2 : 0;
		this.x = rect.x + window._arrowCursorOffsetX;
		this.y = rect.y + window._arrowCursorOffsetY + height;
		this.visible = window.visible && window.isOpen();
		this.opacity = window.opacity;
	};

	Sprite_ArrowCursor.prototype.removeLoopAnimation = function () {
		if (this._animationId) {
			this._animationId = 0;
			this._loopAnimations['cursor'] = null;
			this.updateLoopAnimation();
		}
	};

})();