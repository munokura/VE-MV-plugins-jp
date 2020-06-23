/*
 * ==============================================================================
 * ** Victor Engine MV - Battle Command Window
 * ------------------------------------------------------------------------------
 *  VE_BattleCommandWindow.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Battle Command Window'] = '1.02';

var VictorEngine = VictorEngine || {};
VictorEngine.BattleCommandWindow = VictorEngine.BattleCommandWindow || {};

(function () {

    VictorEngine.BattleCommandWindow.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        VictorEngine.BattleCommandWindow.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Command Window', 'VE - Basic Module', '1.22');
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Battle Command Window', 'VE - Active Time Battle');
    };

    VictorEngine.BattleCommandWindow.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function (name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.BattleCommandWindow.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * @plugindesc v1.02 - Customize the Party Command Window and Actor Command Window.
 * @author Victor Sant
 *
 * @param == Party Command ==
 * @default ================================================
 *
 * @param Skip Party Command
 * @desc Skip Party Command window.
 * true - ON     false - OFF
 * @default false
 *
 * @param Party Window Layer
 * @desc Use window layer to display Party Command Window.
 * true - ON     false - OFF
 * @default true
 *
 * @param Party Window Lines
 * @desc Number of lines the Party Command window have.
 * Default: 4 (allows script code)
 * @default 4
 *
 * @param Party Window Columns
 * @desc Number of columns the Party Command window have.
 * Default: 1 (allows script code)
 * @default 1
 *
 * @param Party Offset X
 * @desc Party Command window X position.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Party Offset Y
 * @desc Party Command window Y position.
 * Default: boxHeight - height (allows script code)
 * @default boxHeight - height
 *
 * @param Party Width
 * @desc Party Command window width.
 * Default: width (allows script code)
 * @default width
 *
 * @param Party Height
 * @desc Party Command window height.
 * Default: height (allows script code)
 * @default height
 *
 * @param Party Back Opacity
 * @desc Party Command window back opacity.
 * Default: this.standardBackOpacity() (allows script code)
 * @default this.standardBackOpacity()
 *
 * @param Party Frame Opacity
 * @desc Party Command window frame opacity.
 * Default: 255 (allows script code)
 * @default 255
 *
 * @param Party Background
 * @desc Party Command background image shown behind the window.
 * Filename (leave blank for no background)
 * @default @@
 *
 * @param Party Back X
 * @desc Party Command background image offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Party Back Y
 * @desc Party Command background image offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Party Text Align
 * @desc Alignment for  Party command text.
 * Left - Center - Right
 * @default Left
 *
 * @param Party Horizontal Centralize
 * @desc Centralize Party command content horizontally.
 * true - ON     false - OFF
 * @default false
 *
 * @param Party Vertical Centralize
 * @desc Centralize Party command content vertically.
 * true - ON     false - OFF
 * @default false
 *
 * @param Party Text X
 * @desc Party Command text position offset X.
 * Default: 6 (allows script code)
 * @default 6
 *
 * @param Party Text Y
 * @desc Party Command text position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Party Content X
 * @desc Party Command content position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Party Content Y
 * @desc Party Command content position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Party Content Back
 * @desc Background image for the Party Command content.
 * Filename (leave blank for no background)
 * @default @@
 *
 * @param Party Content Back X
 * @desc Party Command content image position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Party Content Back Y
 * @desc  Party Command content image position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Party Content Font
 * @desc Party Command display font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Party Content Size
 * @desc Party Command display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Party Content Color
 * @desc Party Command display font color.
 * Default: this.normalColor() (allows script code)
 * @default this.normalColor()
 *
 * @param Party Active X
 * @desc Party Command Active position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Party Active Y
 * @desc Party Command Active position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Party Active Back
 * @desc Background image for the Party Command Active.
 * Filename (leave blank for no background)
 * @default @@
 *
 * @param Party Active Back X
 * @desc Party Command Active image position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Party Active Back Y
 * @desc  Party Command Active image position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Party Active Font
 * @desc Party Command Active display font name.
 * (allows script code, leave blank to use the normal font)
 * @default @@
 *
 * @param Party Active Size
 * @desc Party Command Active display font size.
 * (allows script code, leave blank to use the normal size)
 * @default @@
 *
 * @param Party Active Color
 * @desc Party Command Active display font color.
 * (allows script code, leave blank to use the normal color)
 * @default @@
 *
 * @param == Actor Command ==
 * @default ================================================
 *
 * @param Escape Command
 * @desc Adds the Escape command to each actor window.
 * true - ON     false - OFF
 * @default false
 *
 * @param Actor Window Layer
 * @desc Use window layer to display Actor Command Window.
 * true - ON     false - OFF
 * @default true
 *
 * @param Actor Window Lines
 * @desc Number of lines the Actor Command window have.
 * Default: 4 (allows script code)
 * @default 4
 *
 * @param Actor Window Columns
 * @desc Number of columns the Actor Command window have.
 * Default: 1 (allows script code)
 * @default 1
 *
 * @param Actor Offset X
 * @desc Actor Command window X position.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Actor Offset Y
 * @desc Actor Command window Y position.
 * Default: boxHeight - height (allows script code)
 * @default boxHeight - height
 *
 * @param Actor Width
 * @desc Actor Command window width.
 * Default: width (allows script code)
 * @default width
 *
 * @param Actor Height
 * @desc Actor Command window height.
 * Default: height (allows script code)
 * @default height
 *
 * @param Actor Back Opacity
 * @desc Actor Command window back opacity.
 * Default: this.standardBackOpacity() (allows script code)
 * @default this.standardBackOpacity()
 *
 * @param Actor Frame Opacity
 * @desc Actor Command window frame opacity.
 * Default: 255 (allows script code)
 * @default 255
 *
 * @param Actor Background
 * @desc Actor Command background image shown behind the window.
 * Filename (leave blank for no background)
 * @default @@
 *
 * @param Actor Back X
 * @desc Actor Command background image offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Actor Back Y
 * @desc Actor Command background image offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Actor Text Align
 * @desc Alignment for  Actor command text.
 * Left - Center - Right
 * @default Left
 *
 * @param Actor Horizontal Centralize
 * @desc Centralize Actor command content horizontally.
 * true - ON     false - OFF
 * @default false
 *
 * @param Actor Vertical Centralize
 * @desc Centralize Actor command content vertically.
 * true - ON     false - OFF
 * @default false
 *
 * @param Actor Text X
 * @desc Actor Command text position offset X.
 * Default: 6 (allows script code)
 * @default 6
 *
 * @param Actor Text Y
 * @desc Actor Command text position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Actor Content X
 * @desc Actor Command content position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Actor Content Y
 * @desc Actor Command content position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Actor Content Back
 * @desc Background image for the Actor Command content.
 * Filename (leave blank for no background)
 * @default @@
 *
 * @param Actor Content Back X
 * @desc Actor Command content image position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Actor Content Back Y
 * @desc  Actor Command content image position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Actor Content Font
 * @desc Actor Command display font name.
 * Default: this.standardFontFace() (allows script code)
 * @default this.standardFontFace()
 *
 * @param Actor Content Size
 * @desc Actor Command display font size.
 * Default: this.standardFontSize() (allows script code)
 * @default this.standardFontSize()
 *
 * @param Actor Content Color
 * @desc Actor Command display font color.
 * Default: this.normalColor() (allows script code)
 * @default this.normalColor()
 *
 * @param Actor Active X
 * @desc Actor Command Active position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Actor Active Y
 * @desc Actor Command Active position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Actor Active Back
 * @desc Background image for the Actor Command Active.
 * Filename (leave blank for no background)
 * @default @@
 *
 * @param Actor Active Back X
 * @desc Actor Command Active image position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Actor Active Back Y
 * @desc Actor Command Active image position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Actor Active Font
 * @desc Actor Command Active display font name.
 * (allows script code, leave blank to use the normal font)
 * @default @@
 *
 * @param Actor Active Size
 * @desc Actor Command Active display font size.
 * (allows script code, leave blank to use the normal size)
 * @default @@
 *
 * @param Actor Active Color
 * @desc Actor Command Active display font color.
 * (allows script code, leave blank to use the normal color)
 * @default @@
 *
 * @param Show Faces
 * @desc Show faces for each actor on the Actor Command window.
 * true - ON     false - OFF
 * @default false
 *
 * @param Face Sufix
 * @desc Add a sufix for face graphics shown in Actor Command.
 * Sufix (leave blank for no sufix)
 * @default @@
 *
 * @param Face Width
 * @desc Face display width
 * Default: 144 (allows script code)
 * @default 144
 *
 * @param Face Height
 * @desc Face display height
 * Default: 144 (allows script code)
 * @default 144
 *
 * @param Face Offset X
 * @desc Face image position offset X.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Face Offset Y
 * @desc Face image position offset Y.
 * Default: 0 (allows script code)
 * @default 0
 *
 * @param Picture Offset X
 * @desc Picture image position offset X.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @param Picture Offset Y
 * @desc Picture image position offset Y.
 * Default: 0 (Numeric, can be negative)
 * @default 0
 *
 * @help 
 * ==============================================================================
 *
 * ==============================================================================
 *  Command Picture (notetag for Actors)
 * ------------------------------------------------------------------------------
 *  <command picture: 'filename'>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Displays a picture above the command window (but behind the window content)
 *  for the actor. The image must be placed on the folder '/img/pictures/'
 *    filename : name of the picture image graphic.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Ex.: <command picture: 'Actor1_1'>
 *       <command picture: 'AldoCommand'>
 * ==============================================================================
 *
 * ==============================================================================
 *  Plugin Commands
 * ------------------------------------------------------------------------------
 *
 *  You can use v[id] on the instead of a numeric value to get the value from 
 *  the variable with the id set. For example, v[3] will get the value from the
 *  variable id 3.
 *
 * ------------------------------------------------------------------------------
 * 
 * ------------------------------------------------------------------------------
 *  SetCommandPicture Id filename
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  Set a new command picture to be displayed for the actor command window.
 *  The image must be placed on the folder '/img/pictures/'
 *    id : id of the actor.
 *    filename : name of the picture image graphic.
 * ------------------------------------------------------------------------------
 * 
 * ------------------------------------------------------------------------------
 *  ClearCommandPicture Id
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  If you changed a command picture with the command 'SetCommandPicture',
 *  this command will undo that change, using the default picture (if any)
 *    id : id of the actor.
 *    filename : name of the picture image graphic.
 * ==============================================================================
 *
 * ==============================================================================
 * Additional Information:
 * ------------------------------------------------------------------------------
 *
 *  - Plugin Parameters Setup
 *  Most of the setup for this plugin is made through plugin parameters.
 *  Several of those plugin parameters allows the use of script codes. If this is
 *  the case, you can use any valid code for basic windows.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Window Lines and Columns
 *  The 'Window Lines' and 'Window Columns' plugin parameters changes how the
 *  commands will be organized on the status window. By default it's show as 4
 *  lines. You can change the number of lines and columns for the display.
 *  You can use script codes that returns numeric values as the value for them.
 *
 *  - Windows Position and Size
 *  The parameters 'Offset X' and 'Offset Y' defines the window position and
 *  the parameters 'Width' and 'Height' defines the size.
 *  You can use script codes that returns numeric values as the value for them.
 *
 *  You can use 'boxWidth' to get the screen width, 'boxHeight' to the screen
 *  height, 'width' to get the default RMMV window width, 'height' for the
 *  default window height. For the actor window, you can use 'index' for the 
 *  inputing actor index, 'screenX' to get the actor screen X position and
 *  'screenY' to get the actor screen Y position. Notice that this works only
 *  for the default battle and some of my own plugins, If other authors plugins
 *  change the actor's position, then it might not get the correct value.
 *
 *  - Windows Background
 *  The 'Background' is placed behind the window itself. It's advised to
 *  lower the opacity, otherwise the window will cover the image. You can adjust
 *  it's position with the parameters 'Back X' and 'Back Y'.
 *  The image graphic should be placed on the folder 'img/system/'
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Window Layer
 *  By default, all windows are placed on the same layer. When a window overlaps
 *  another, the area covered behind the front window is cleared. This can be
 *  an issue when using windows with transparent windowskin. You can change that
 *  by turing off the parameter 'Window Layer'. This way, the window will use
 *  the sprites layer, and will be displayed above other windows.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Content Offset
 *  The parameters 'Content X' and 'Content Y' can be used to  adjust the
 *  position of the content for each command. You can use script codes that 
 *  returns numeric values as the value for them, you can also use 'index'
 *  for the command index.
 *
 *  - Content Background
 *  The 'Content Back' is placed behind the command text, but above the 
 *  windowskin. The image is shown for each command. You can adjust the images
 *  offset with the parameters 'Content Back X' and 'Content Back Y'.
 *  The image graphic should be placed on the folder 'img/system/'
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Active Offset
 *  The parameters 'Active X' and 'Active Y' can be used to  adjust the
 *  position of the content for selected command. You can use script codes that 
 *  returns numeric values as the value for them, you can also use 'index'
 *  for the command index.
 *
 *  - Active Background
 *  The 'Active Back' is placed behind the command text, but above the 
 *  windowskin. The image is shown for the selected command. You can adjust the
 *  images offset with the parameters 'Active Back X' and 'Active Back Y'.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Font Setup
 *  There are font setup for both the content and active, the content setup
 *  is used for unselected commands, while the active setup is used for
 *  the selected commands. You can leave the active setup blank, this way
 *  it will use the same setup as the content.
 *
 *  - Fontface
 *  The parameters 'Fontface' defines the font command text. You can use script
 *  codes that returns a string with the fontname se the value for it. 
 *
 *  - Fontsize
 *  The parameters 'Fontsize' defines the font size for the command text.
 *  You can use script codes that returns numeric values as the value for it. 
 *
 *  - Color
 *  The parameter 'Color' defines the font color for the command text.
 *  The color must be either a hex color code (#000000) or a script code
 *  that returns a color value. If using the plugin 'SFonts' only the codes
 *  will work (hex codes will not work).
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Show Faces
 *  For the actor command only, if true you can show the current inputing actor's
 *  face on the command window.
 *
 *  - Face Sufix
 *  The parameter 'Face Sufix' set a sufix for the actor command window face,
 *  this can be used if you want the faces displayed on battle to be different 
 *  from the faces used everywhere else. The face must have the same filename
 *  as the original face + the sufix. For example, if you set the sufix [command]
 *  and have a face named 'Actor1' the battle face should be 'Actor1[command]'
 *  The index for the face is not changed, keep that in mind while formating the
 *  actor command faces.
 *
 *  - Face Offset and Size
 *  The parameters 'Face Offset X' and 'Face Offset Y' defines the face offset
 *  position and the parameters 'Face Width' and 'Face Height' defines the size.
 *  You can use script codes that returns numeric values as the value for them.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Command Pictures
 *  You can display pictures exclusive for each actor on the actor command window.
 *  The face graphic is set either with a notetag or with event plugin commands.
 *  You can adjust the images offset with the parameters 'Picture Offset X' and 
 *  'Picture Offset Y'.
 *  The image graphic should be placed on the folder 'img/pictures/'
 *
 * ==============================================================================
 * 
 * ==============================================================================
 *  Compatibility:
 * ------------------------------------------------------------------------------
 *  To be used together with this plugin, the following plugins must be placed
 *  bellow this plugin:
 *     VE - Active Time Battle
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.04.30 > First release.
 *  v 1.01 - 2016.05.07 > Added 'screenX' and 'screenY' for the actor command.
 *  v 1.02 - 2016.06.30 > Compatibility with Active Time Battle.
 * ==============================================================================
 */
/*:ja
 * @plugindesc v1.02 パーティコマンドウィンドウとアクターコマンドウィンドウをカスタマイズできます
 * @author Victor Sant
 *
 * @param == Party Command ==
 * @text -- パーティコマンド --
 * @default ================================================
 *
 * @param Skip Party Command
 * @text パーティスキップ
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc パーティコマンドウィンドウをスキップ
 * 有効:true / 無効:false
 * @default false
 *
 * @param Party Window Layer
 * @text パーティウィンドウレイヤー
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc パーティコマンドウィンドウを表示にはウィンドウレイヤーを使用
 * 有効:true / 無効:false
 * @default true
 *
 * @param Party Window Lines
 * @text パーティウィンドウ行数
 * @desc パーティーコマンドウィンドウの行数
 * デフォルト: 4 (JavaScript使用可)
 * @default 4
 *
 * @param Party Window Columns
 * @text パーティウィンドウ列数
 * @desc パーティーコマンドウィンドウの列数
 * デフォルト: 1 (JavaScript使用可)
 * @default 1
 *
 * @param Party Offset X
 * @text パーティオフセットX
 * @desc パーティーコマンドウィンドウのX位置
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Party Offset Y
 * @text パーティオフセットY
 * @desc パーティーコマンドウィンドウのY位置
 * デフォルト: boxHeight - height (JavaScript使用可)
 * @default boxHeight - height
 *
 * @param Party Width
 * @text パーティ幅
 * @desc パーティーコマンドウィンドウの幅
 * デフォルト: width (JavaScript使用可)
 * @default width
 *
 * @param Party Height
 * @text パーティ高さ
 * @desc パーティーコマンドウィンドウの高さ
 * デフォルト: height (JavaScript使用可)
 * @default height
 *
 * @param Party Back Opacity
 * @text パーティ背景の不透明度
 * @desc パーティコマンドウィンドウ背景の不透明度
 * デフォルト: this.standardBackOpacity() (JavaScript使用可)
 * @default this.standardBackOpacity()
 *
 * @param Party Frame Opacity
 * @text パーティフレームの不透明度
 * @desc パーティコマンドウィンドウのフレームの不透明度
 * デフォルト: 255 (JavaScript使用可)
 * @default 255
 *
 * @param Party Background
 * @text パーティ背景
 * @desc パーティコマンドの背景画像を表示
 * ファイル名 (使わない場合、無入力)
 * @default @@
 *
 * @param Party Back X
 * @text パーティ背景X
 * @type number
 * @min -9007
 * @max 9007
 * @desc パーティコマンドの背景画像のオフセットX
 * デフォルト: 0 (正負値)
 * @default 0
 *
 * @param Party Back Y
 * @text パーティ背景Y
 * @type number
 * @min -9007
 * @max 9007
 * @desc パーティーコマンドの背景画像のオフセットY
 * デフォルト: 0 (正負値)
 * @default 0
 *
 * @param Party Text Align
 * @text パーティ文字揃え
 * @type select
 * @option 左
 * @value Left
 * @option 中央
 * @value Center
 * @option 右
 * @value Right
 * @desc パーティーコマンドの文字揃え
 * 左:Left / 中央:Center / 右:Right
 * @default Left
 *
 * @param Party Horizontal Centralize
 * @text パーティの水平集中
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc パーティコマンドの内容を水平方向に集中
 * 有効:true / 無効:false
 * @default false
 *
 * @param Party Vertical Centralize
 * @text パーティの縦割り集中
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc パーティコマンドの内容を縦方向に集中
 * 有効:true / 無効:false
 * @default false
 *
 * @param Party Text X
 * @text パーティテキストX
 * @desc パーティコマンドテキスト位置オフセットX
 * デフォルト: 6 (JavaScript使用可)
 * @default 6
 *
 * @param Party Text Y
 * @text パーティテキストY
 * @desc パーティコマンドテキスト位置オフセットY
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Party Content X
 * @text パーティコマンドX
 * @desc パーティーコマンド内容の位置オフセットX
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Party Content Y
 * @text パーティコマンドY
 * @desc パーティーコマンドの内容の位置をオフセット
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Party Content Back
 * @text パーティコマンド背景画像
 * @desc パーティーコマンドコンテンツの背景画像
 * ファイル名 (使わない場合、無入力)
 * @default @@
 *
 * @param Party Content Back X
 * @text パーティコマンド背景X
 * @desc パーティーコマンドコンテンツ画像位置オフセットX
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Party Content Back Y
 * @text パーティコマンド背景Y
 * @desc パーティーコマンド内容の画像位置オフセットY
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Party Content Font
 * @text パーティコマンドフォント
 * @desc パーティーコマンド表示フォント名
 * デフォルト: this.standardFontFace() (JavaScript使用可)
 * @default this.standardFontFace()
 *
 * @param Party Content Size
 * @text パーティコマンドサイズ
 * @desc パーティコマンド表示フォントサイズ
 * デフォルト: this.standardFontSize() (JavaScript使用可)
 * @default this.standardFontSize()
 *
 * @param Party Content Color
 * @text パーティコマンドの色
 * @desc パーティーコマンド表示フォントの色
 * デフォルト: this.normalColor() (JavaScript使用可)
 * @default this.normalColor()
 *
 * @param Party Active X
 * @text パーティアクティブX
 * @desc パーティコマンドアクティブ位置オフセットX
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Party Active Y
 * @text パーティアクティブY
 * @desc パーティーコマンドアクティブ位置オフセットY
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Party Active Back
 * @text パーティアクティブ背景画像
 * @desc パーティーコマンドアクティブの背景画像
 * ファイル名 (使わない場合、無入力)
 * @default @@
 *
 * @param Party Active Back X
 * @text パーティアクティブ背景X
 * @desc パーティーコマンドアクティブ画像位置オフセットX
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Party Active Back Y
 * @text パーティアクティブ背景Y
 * @desc パーティーコマンドアクティブの画像位置オフセットY
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Party Active Font
 * @text パーティアクティブフォント
 * @desc パーティーコマンドアクティブの表示フォント名
 * (JavaScript使用可。使わない場合、無入力)
 * @default @@
 *
 * @param Party Active Size
 * @text パーティアクティブサイズ
 * @desc パーティーコマンドアクティブの表示フォントサイズ
 * (JavaScript使用可。使わない場合、無入力)
 * @default @@
 *
 * @param Party Active Color
 * @text パーティアクティブ色
 * @desc パーティコマンドアクティブの表示フォントの色
 * (JavaScript使用可。使わない場合、無入力)
 * @default @@
 *
 * @param == Actor Command ==
 * @text -- アクターコマンド --
 * @default ================================================
 *
 * @param Escape Command
 * @text 逃亡コマンド
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc 各アクターウィンドウに逃げるコマンドを追加
 * 有効:true / 無効:false
 * @default false
 *
 * @param Actor Window Layer
 * @text アクターウィンドウレイヤー
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc ウィンドウレイヤーを使用してアクターコマンドウィンドウを表示
 * 有効:true / 無効:false
 * @default true
 *
 * @param Actor Window Lines
 * @text アクターのウィンドウ線
 * @desc アクターコマンドウィンドウの行数
 * デフォルト: 4 (JavaScript使用可)
 * @default 4
 *
 * @param Actor Window Columns
 * @text アクターウィンドウの列数
 * @desc アクターコマンドウィンドウの列数
 * デフォルト: 1 (JavaScript使用可)
 * @default 1
 *
 * @param Actor Offset X
 * @text アクターオフセットX
 * @desc アクタコマンドウィンドウのX位置
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Actor Offset Y
 * @text アクターオフセットY
 * @desc アクターコマンドウィンドウのY位置
 * デフォルト: boxHeight - height (JavaScript使用可)
 * @default boxHeight - height
 *
 * @param Actor Width
 * @text アクター幅
 * @desc アクターコマンドウィンドウの幅
 * デフォルト: width (JavaScript使用可)
 * @default width
 *
 * @param Actor Height
 * @text アクター高さ
 * @desc アクターコマンドウィンドウの高さ
 * デフォルト: height (JavaScript使用可)
 * @default height
 *
 * @param Actor Back Opacity
 * @text アクター背景不透明度
 * @desc アクターコマンドウィンドウ背景の不透明度
 * デフォルト: this.standardBackOpacity() (JavaScript使用可)
 * @default this.standardBackOpacity()
 *
 * @param Actor Frame Opacity
 * @text アクターフレームの不透明度
 * @desc アクターコマンドウィンドウのフレームの不透明度
 * デフォルト: 255 (JavaScript使用可)
 * @default 255
 *
 * @param Actor Background
 * @text アクター背景画像
 * @desc アクターコマンドウィンドウの背景画像
 * ファイル名 (使わない場合、無入力)
 * @default @@
 *
 * @param Actor Back X
 * @text アクター背景X
 * @type number
 * @min -9007
 * @max 9007
 * @desc アクターコマンドの背景画像オフセットX
 * デフォルト: 0 (正負値)
 * @default 0
 *
 * @param Actor Back Y
 * @text アクター背景Y
 * @type number
 * @min -9007
 * @max 9007
 * @desc アクターコマンド背景画像のオフセットY
 * デフォルト: 0 (正負値)
 * @default 0
 *
 * @param Actor Text Align
 * @text アクターテキストの行揃え
 * @type select
 * @option 左
 * @value Left
 * @option 中央
 * @value Center
 * @option 右
 * @value Right
 * @desc アクターコマンドの行揃え
 * 左:Left / 中央:Center / 右:Right
 * @default Left
 *
 * @param Actor Horizontal Centralize
 * @text アクター水平集中
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc アクターコマンドの内容を横方向に集中させる
 * 有効:true / 無効:false
 * @default false
 *
 * @param Actor Vertical Centralize
 * @text アクター垂直集中
 * @type boolean
 * @on 有効
 * @off 無効
 * @desc アクターコマンドの内容を縦方向に集中させる
 * 有効:true / 無効:false
 * @default false
 *
 * @param Actor Text X
 * @text アクターテキストX
 * @desc アクターコマンドのテキスト位置オフセットX
 * デフォルト: 6 (JavaScript使用可)
 * @default 6
 *
 * @param Actor Text Y
 * @text アクターテキストY
 * @desc アクターコマンドテキスト位置オフセットY
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Actor Content X
 * @text アクターコンテンツX
 * @desc アクターコマンド内容位置オフセットX
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Actor Content Y
 * @text アクターコンテンツY
 * @desc アクターコマンドのコンテンツ位置オフセットY
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Actor Content Back
 * @text アクターコンテンツ背景画像
 * @desc アクターコマンドコンテンツの背景画像
 * ファイル名 (使わない場合、無入力)
 * @default @@
 *
 * @param Actor Content Back X
 * @text アクターコンテンツ背景X
 * @desc アクターコマンドコンテンツ画像位置オフセットX
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Actor Content Back Y
 * @text アクターコンテンツ背景Y
 * @desc アクターコマンドコンテンツ画像位置オフセットY
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Actor Content Font
 * @text アクターコンテンツフォント
 * @desc アクターコマンド表示フォント名
 * デフォルト: this.standardFontFace() (JavaScript使用可)
 * @default this.standardFontFace()
 *
 * @param Actor Content Size
 * @text アクターコンテンツサイズ
 * @desc アクターコマンド表示フォントサイズ
 * デフォルト: this.standardFontSize() (JavaScript使用可)
 * @default this.standardFontSize()
 *
 * @param Actor Content Color
 * @text アクターコンテンツ色
 * @desc フォントの色を表示
 * デフォルト: this.normalColor() (JavaScript使用可)
 * @default this.normalColor()
 *
 * @param Actor Active X
 * @text アクターアクティブX
 * @desc アクターコマンドアクティブ位置オフセットX
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Actor Active Y
 * @text アクターアクティブY
 * @desc アクターコマンドのアクティブ位置オフセットY
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Actor Active Back
 * @text アクターアクティブ背景画像
 * @desc アクターコマンドアクティブの背景画像
 * ファイル名 (使わない場合、無入力)
 * @default @@
 *
 * @param Actor Active Back X
 * @text アクターアクティブ背景X
 * @desc アクターコマンドアクティブの画像位置オフセットX
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Actor Active Back Y
 * @text アクターアクティブ背景Y
 * @desc アクターコマンドアクティブの画像位置オフセットY
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Actor Active Font
 * @text アクターアクティブフォント
 * @desc アクターコマンドアクティブの表示フォント名
 * (JavaScript使用可。使わない場合、無入力)
 * @default @@
 *
 * @param Actor Active Size
 * @text アクターのアクティブサイズ
 * @desc アクターコマンドアクティブ表示フォントサイズ
 * (JavaScript使用可。使わない場合、無入力)
 * @default @@
 *
 * @param Actor Active Color
 * @text アクターアクティブ色
 * @desc アクターコマンドアクティブ表示フォントの色
 * (JavaScript使用可。使わない場合、無入力)
 * @default @@
 *
 * @param Show Faces
 * @text 顔画像表示
 * @type boolean
 * @on 表示
 * @off 非表示
 * @desc アクターコマンドウィンドウに各アクターの顔を表示
 * 表示:true / 非表示:false
 * @default false
 *
 * @param Face Sufix
 * @text 顔画像接頭辞
 * @desc アクターコマンドで表示される顔画像に接頭辞を追加
 * 接頭辞 (接頭辞を使わない場合、無入力)
 * @default @@
 *
 * @param Face Width
 * @text 顔画像の幅
 * @desc 顔画像の表示幅
 * デフォルト: 144 (JavaScript使用可)
 * @default 144
 *
 * @param Face Height
 * @text 顔画像の高さ
 * @desc 顔画像の高さ
 * デフォルト: 144 (JavaScript使用可)
 * @default 144
 *
 * @param Face Offset X
 * @text 顔画像オフセットX
 * @desc 顔画像位置オフセットX
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Face Offset Y
 * @text 顔画像オフセットY
 * @desc 顔画像位置オフセットY
 * デフォルト: 0 (JavaScript使用可)
 * @default 0
 *
 * @param Picture Offset X
 * @text ピクチャオフセットX
 * @type number
 * @min -9007
 * @max 9007
 * @desc ピクチャ位置オフセットX
 * デフォルト: 0 (正負値)
 * @default 0
 *
 * @param Picture Offset Y
 * @text ピクチャオフセットY
 * @type number
 * @min -9007
 * @max 9007
 * @desc ピクチャ位置オフセットY
 * デフォルト: 0 (正負値)
 * @default 0
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/battle-command-window/
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
 *
 * ===========================================================================
 *  コマンドピクチャー（アクターのメモタグ)
 * ---------------------------------------------------------------------------
 *  <command picture: 'filename'>
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * コマンドウィンドウの上にアクターの画像を表示します。
 * (ただしウィンドウの内容の後ろ)
 * 画像はフォルダ'/img/pictures/'に置かなければなりません。
 *    filename : ピクチャ画像のファイル名
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  例 : <command picture: 'Actor1_1'>
 *       <command picture: 'AldoCommand'>
 * ===========================================================================
 *
 * ===========================================================================
 *  プラグインコマンド
 * ---------------------------------------------------------------------------
 *
 * 数値の代わりにv[id]を使用して、idが設定された変数から値を取得できます。
 * 例えば、v[3]は変数id3から値を取得します。
 *
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  SetCommandPicture Id filename
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * アクターコマンドウィンドウに表示する新しいコマンド画像を設定します。
 * 画像はフォルダ'/img/pictures/'に配置されている必要があります。
 *    id : アクターID
 *    filename : ピクチャ画像のファイル名
 * ---------------------------------------------------------------------------
 *
 * ---------------------------------------------------------------------------
 *  ClearCommandPicture Id
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * 'SetCommandPicture'コマンドでコマンド画像を変更した場合、
 * このコマンドはその変更を元に戻し、
 * デフォルトの画像を使用します(もしあれば)
 *    id : アクターID
 *    filename : ピクチャ画像のファイル名
 * ===========================================================================
 *
 * ===========================================================================
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 *  - Plugin Parameters Setup
 * プラグインの設定のほとんどは、プラグインのパラメータを介して行われます。
 * パラメータのいくつかは、JavaScriptの使用が可能です。
 * この場合、基本的なウィンドウで有効なコードを使用できます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Window Lines and Columns
 * 'Window Lines'と'Window Columns'プラグインのパラメータは、
 * ステータスウィンドウ上でのコマンドの構成を変更します。
 * デフォルトでは4行で表示されます。
 * 表示する行数や列数を変更できます。
 * 数値を返すJavaScriptを使用できます。
 *
 *  - Windows Position and Size
 * パラメータ'Offset X'と'Offset Y'はウィンドウの位置を定義し、
 * パラメータ'Width'と'Height'はサイズを定義します。
 * 値を返すJavaScriptを使用できます。
 *
 * 'boxWidth'で画面の幅を、'boxHeight'で画面の高さを、
 * 'width'でデフォルトのRPGツクールMVのウィンドウの幅を、
 * 'height'でデフォルトのウィンドウの高さを取得できます。
 * アクターウィンドウについては、
 * 入力するアクターのインデックスに'index'を、
 * アクター画面のXの位置を取得するには'screenX'を、
 * アクター画面のYの位置を取得するには'screenY'を使用します。
 * 他のプラグインでアクターの位置を変更した場合、
 * 正しい値が得られない可能性があることに注意してください。
 *
 *  - Windows Background
 * 背景'はウィンドウの後ろに配置されます。
 * 不透明度を下げておくことをお勧めします。
 * この位置は'Back X'と'Back Y'パラメータで調整できます。
 * 画像画像は'img/system/'フォルダに配置してください。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Window Layer
 * デフォルトでは、全てのウィンドウが同じレイヤーに配置されます。
 * ウィンドウが他のウィンドウと重なった場合、
 * 前のウィンドウの後ろのリージョンはクリアされます。
 * 透明なウィンドウスキンを使用しているウィンドウを使用している場合、
 * 問題になることがあります。
 * 'ウィンドウレイヤー'パラメータをオフにすることで変更できます。
 * この方法では、ウィンドウはスプライト・レイヤーを使用し、
 * 他のウィンドウの上に表示されます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Content Offset
 * パラメータ'Content X'と'Content Y'を使用して、
 * 各コマンドのコンテンツの位置を調整できます。
 * それらの値として数値を返すJavaScriptを使用できますが、
 * コマンドのインデックスには'index'を使用することもできます。
 *
 *  - Content Background
 * 'Content Back'はコマンドテキストの後ろに配置されていますが、
 * ウィンドウスキンの上に配置されています。
 * 画像は各コマンド毎に表示されます。
 * 画像のオフセットは'Content Back X'と'Content Back Y'というパラメータで
 * 調整できます。
 * 背景画像は'img/system/'フォルダに配置してください。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Active Offset
 * パラメータ'ActiveX'と'ActiveY'は、
 * 選択されたコマンドに対するコンテンツの位置を調整するために使用できます。
 * 数値を値として返すJavaScriptを使用できますが、
 * コマンドのインデックスには'index'を使用することもできます。
 *
 *  - Active Background
 * 'Active Back'はコマンドテキストの後ろに配置されていますが、
 * ウィンドウスキンの上に配置されています。
 * 選択されたコマンドの画像が表示されます。
 * 'Active Back X'と'Active Back Y'パラメータで画像のオフセットを調整できます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Font Setup
 * コンテンツと有効の両方のフォント設定があり、
 * コンテンツの設定は選択されていないコマンドに使用され、
 * 有効の設定は選択されたコマンドに使用されます。
 * 有効設定を無入力にしておくと、コンテンツと同じ設定を使用できます。
 *
 *  - Fontface
 * パラメータ'Fontface'は、
 * フォントコマンドのテキストを定義します。
 * fontname seの値を文字列として返すJavaScriptを使用できます。
 *
 *  - Fontsize
 * パラメータ'Fontsize'は、
 * コマンドテキストのフォントサイズを定義します。
 * その値として数値を返すJavaScriptを使用できます。
 *
 *  - Color
 * 'Color'パラメータは、コマンドテキストのフォント色を定義します。
 * 色は、16進数のカラーコード(#000000)か、色の値を返すJavaScriptのどちらかです。
 * プラグイン'SFonts'を使用している場合、
 * JavaScriptのみが動作します(16進コードは動作しません)。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Show Faces
 * アクターコマンドの場合のみ、trueの場合、
 * 現在入力されているアクターの顔をコマンドウィンドウに表示できます。
 *
 *  - Face Sufix
 * パラメータ'Face Sufix'は、
 * アクターコマンドウィンドウの顔の接頭辞を設定します。
 * 顔のファイル名は、元の顔と同じファイル名+接頭辞でなければなりません。
 * 例えば、接頭辞[command]を設定して'Actor1'という名前の顔を持っている場合、
 * 戦闘時の顔は'Actor1[command]'となります。
 * 顔のインデックスは変更されません。
 *
 *  - Face Offset and Size
 * パラメータ'Face Offset X'と'Face Offset Y'は顔のオフセット位置を定義し、
 * パラメータ'Face Width'と'Face Height'はサイズを定義します。
 * それらの値を数値として返すJavaScriptを使用できます。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  - Command Pictures
 * アクターコマンドウィンドウには、アクター毎に専用のピクチャを表示できます。
 * ピクチャは、メモタグ/イベントプラグインコマンドで設定します。
 * ピクチャのオフセットは'Picture Offset X'と'Picture Offset Y'で調整できます。
 * ピクチャは'img/pictures/'フォルダに配置してください。
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  互換性
 * ---------------------------------------------------------------------------
 * このプラグインと一緒に使用する場合、
 * 以下のプラグインは、このプラグインの下に配置する必要があります。
 *     VE - Active Time Battle
 * ===========================================================================
 *
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2016.04.30 > First release.
 *  v 1.01 - 2016.05.07 > Added 'screenX' and 'screenY' for the actor command.
 *  v 1.02 - 2016.06.30 > Compatibility with Active Time Battle.
 * ===========================================================================
 */

(function () {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.BattleCommandWindow = {};
        VictorEngine.Parameters.BattleCommandWindow.FaceSufix = String(parameters["Face Sufix"]).trim();
        VictorEngine.Parameters.BattleCommandWindow.FaceWidth = String(parameters["Face Width"]).trim();
        VictorEngine.Parameters.BattleCommandWindow.FaceHeight = String(parameters["Face Height"]).trim();
        VictorEngine.Parameters.BattleCommandWindow.FaceOffsetX = String(parameters["Face Offset X"]).trim();
        VictorEngine.Parameters.BattleCommandWindow.FaceOffsetY = String(parameters["Face Offset Y"]).trim();
        VictorEngine.Parameters.BattleCommandWindow.PictureOffsetX = Number(parameters["Picture Offset X"]) || 0;
        VictorEngine.Parameters.BattleCommandWindow.PictureOffsetY = Number(parameters["Picture Offset Y"]) || 0;
        VictorEngine.Parameters.BattleCommandWindow.SkipCommand = eval(parameters["Skip Party Command"]);
        VictorEngine.Parameters.BattleCommandWindow.ShowFaces = eval(parameters["Show Faces"]);
        VictorEngine.Parameters.BattleCommandWindow.EscapeCommand = eval(parameters["Escape Command"]);
        var list = ['Actor', 'Party'];
        for (var i = 0; i < list.length; i++) {
            var type = list[i];
            VictorEngine.Parameters.BattleCommandWindow[type + ' Lines'] = String(parameters[type + ' Window Lines']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Columns'] = String(parameters[type + ' Window Columns']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Offset X'] = String(parameters[type + ' Offset X']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Offset Y'] = String(parameters[type + ' Offset Y']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Width'] = String(parameters[type + ' Width']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Height'] = String(parameters[type + ' Height']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Back Opacity'] = String(parameters[type + ' Back Opacity']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Frame Opacity'] = String(parameters[type + ' Frame Opacity']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Background'] = String(parameters[type + ' Background']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Text X'] = String(parameters[type + ' Text X']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Text Y'] = String(parameters[type + ' Text Y']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Content X'] = String(parameters[type + ' Content X']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Content Y'] = String(parameters[type + ' Content Y']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Content Back'] = String(parameters[type + ' Content Back']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Content Back X'] = String(parameters[type + ' Content Back X']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Content Back Y'] = String(parameters[type + ' Content Back Y']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Content Font'] = String(parameters[type + ' Content Font']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Content Size'] = String(parameters[type + ' Content Size']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Content Color'] = String(parameters[type + ' Content Color']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Active X'] = String(parameters[type + ' Active X']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Active Y'] = String(parameters[type + ' Active Y']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Active Back'] = String(parameters[type + ' Active Back']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Active Back X'] = String(parameters[type + ' Active Back X']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Active Back Y'] = String(parameters[type + ' Active Back Y']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Active Font'] = String(parameters[type + ' Active Font']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Active Size'] = String(parameters[type + ' Active Size']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Active Color'] = String(parameters[type + ' Active Color']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Text Align'] = String(parameters[type + ' Text Align']).trim();
            VictorEngine.Parameters.BattleCommandWindow[type + ' Back X'] = Number(parameters[type + ' Back X']) || 0;
            VictorEngine.Parameters.BattleCommandWindow[type + ' Back Y'] = Number(parameters[type + ' Back Y']) || 0;
            VictorEngine.Parameters.BattleCommandWindow[type + ' Horizontal'] = eval(parameters[type + ' Horizontal Centralize']);
            VictorEngine.Parameters.BattleCommandWindow[type + ' Vertical'] = eval(parameters[type + ' Vertical Centralize']);
            VictorEngine.Parameters.BattleCommandWindow[type + ' Layer'] = eval(parameters[type + ' Window Layer']);
        }
    }

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.BattleCommandWindow.loadParameters = VictorEngine.loadParameters;
    VictorEngine.loadParameters = function () {
        VictorEngine.BattleCommandWindow.loadParameters.call(this);
        VictorEngine.BattleCommandWindow.processParameters();
    };

    VictorEngine.BattleCommandWindow.loadNotetagsValues = VictorEngine.loadNotetagsValues;
    VictorEngine.loadNotetagsValues = function (data, index) {
        VictorEngine.BattleCommandWindow.loadNotetagsValues.call(this, data, index);
        if (this.objectSelection(index, ['actor'])) {
            VictorEngine.BattleCommandWindow.loadNotes(data);
        }
    };

    VictorEngine.BattleCommandWindow.processParameters = function () {
        if (!this.loaded) {
            this.loaded = true;
            this.setupPartyCommand();
            this.setupActorCommand();
        }
    };

    VictorEngine.BattleCommandWindow.loadNotes = function (data) {
        data.commandPicture = data.commandPicture || '';
        this.processNotes(data);
    };

    VictorEngine.BattleCommandWindow.processNotes = function (data) {
        var match;
        var regex = new RegExp("<command picture:[ ]*('[^\']+'|\"[^\"]+\")[ ]*>", 'gi');
        while (match = regex.exec(data.note)) {
            data.commandPicture = match[1].slice(1, -1);
        };
    };

    VictorEngine.BattleCommandWindow.setupPartyCommand = function () {
        this.party = this.setupCommand('Party');
        this.party.skip = VictorEngine.Parameters.BattleCommandWindow.SkipCommand;
    };

    VictorEngine.BattleCommandWindow.setupActorCommand = function () {
        var parameters = VictorEngine.Parameters.BattleCommandWindow;
        this.actor = this.setupCommand('Actor');
        this.actor.escape = parameters.EscapeCommand
        this.face = {};
        this.face.show = parameters.ShowFaces;
        this.face.sufix = parameters.FaceSufix;
        this.face.width = parameters.FaceWidth;
        this.face.height = parameters.FaceHeight;
        this.face.x = parameters.FaceOffsetX;
        this.face.y = parameters.FaceOffsetY;
        this.picture = {};
        this.picture.x = parameters.PictureOffsetX;
        this.picture.y = parameters.PictureOffsetY;
    };

    VictorEngine.BattleCommandWindow.setupCommand = function (type) {
        var parameters = VictorEngine.Parameters.BattleCommandWindow;
        var result = {};
        result.x = parameters[type + ' Offset X'];
        result.y = parameters[type + ' Offset Y'];
        result.lines = parameters[type + ' Lines'];
        result.columns = parameters[type + ' Columns'];
        result.width = parameters[type + ' Width'];
        result.height = parameters[type + ' Height'];
        result.layer = parameters[type + ' Layer'];
        result.backOpacity = parameters[type + ' Back Opacity'];
        result.frameOpacity = parameters[type + ' Frame Opacity'];
        result.background = parameters[type + ' Background'];
        result.backgroundX = parameters[type + ' Back X'];
        result.backgroundY = parameters[type + ' Back Y'];
        result.textAlign = parameters[type + ' Text Align'];
        result.horizontal = parameters[type + ' Horizontal'];
        result.vertical = parameters[type + ' Vertical'];
        result.content = {};
        result.content.x = parameters[type + ' Content X'];
        result.content.y = parameters[type + ' Content Y'];
        result.content.textX = parameters[type + ' Text X'];
        result.content.textY = parameters[type + ' Text Y'];
        result.content.back = parameters[type + ' Content Back'];
        result.content.backX = parameters[type + ' Content Back X'];
        result.content.backY = parameters[type + ' Content Back Y'];
        result.content.font = parameters[type + ' Content Font'];
        result.content.size = parameters[type + ' Content Size'];
        result.content.color = parameters[type + ' Content Color'];
        result.active = {};
        result.active.x = parameters[type + ' Active X'];
        result.active.y = parameters[type + ' Active Y'];
        result.active.back = parameters[type + ' Active Back'];
        result.active.backX = parameters[type + ' Active Back X'];
        result.active.backY = parameters[type + ' Active Back Y'];
        result.active.font = parameters[type + ' Active Font'];
        result.active.size = parameters[type + ' Active Size'];
        result.active.color = parameters[type + ' Active Color'];
        return result;
    };

    //=============================================================================
    // BattleManager
    //=============================================================================

    VictorEngine.BattleCommandWindow.startAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        var subject = this._subject;
        var action = subject.currentAction();
        if (action.isEscape()) {
            this._phase = 'action';
            this._action = action;
            this._targets = [];
            this.refreshStatus();
            this._logWindow.startEscape(subject, action);
        } else {
            VictorEngine.BattleCommandWindow.startAction.call(this);
        }
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    VictorEngine.BattleCommandWindow.isValid = Game_Action.prototype.isValid;
    Game_Action.prototype.isValid = function () {
        return this.isEscape() || VictorEngine.BattleCommandWindow.isValid.call(this);
    };

    VictorEngine.BattleCommandWindow.item = Game_Action.prototype.item;
    Game_Action.prototype.item = function () {
        if (this.isEscape()) {
            return this._escapeAction;
        } else {
            return VictorEngine.BattleCommandWindow.item.call(this);
        }
    };

    //=============================================================================
    // Game_Actor
    //=============================================================================

    Game_Actor.prototype.commandPicture = function () {
        return this._commandPicture || this.actor().commandPicture;
    };

    Game_Actor.prototype.setCommandPicture = function (picture) {
        return this._commandPicture = picture;
    };

    Game_Actor.prototype.clearCommandPicture = function () {
        return this._commandPicture = '';
    };

    //=============================================================================
    // Game_Unit
    //=============================================================================

    VictorEngine.BattleCommandWindow.clearActions = Game_Unit.prototype.clearActions;
    Game_Unit.prototype.clearActions = function () {
        if (!this._skipClear) {
            VictorEngine.BattleCommandWindow.clearActions.call(this);
        }
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================

    VictorEngine.BattleCommandWindow.pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        VictorEngine.BattleCommandWindow.pluginCommand.call(this, command, args);
        if (command.toLowerCase() === 'setcommandpicture') {
            var v = $gameVariables._data;
            var actor = $gameActors.actor(Number(eval(args[0])));
            if (actor) {
                actor.setCommandPicture(args[1]);
            }
        }
        if (command.toLowerCase() === 'clearcommandpicture') {
            var v = $gameVariables._data;
            var actor = $gameActors.actor(Number(eval(args[0])));
            if (actor) {
                actor.clearCommandPicture();
            }
        }
    };

    //=============================================================================
    // Window_BattleLog
    //=============================================================================

    VictorEngine.BattleCommandWindow.endAction = Window_BattleLog.prototype.endAction;
    Window_BattleLog.prototype.endAction = function (subject) {
        VictorEngine.BattleCommandWindow.endAction.call(this, subject);
        if (subject.isEscapeCommand()) {
            this.push('performEscape', subject);
            subject.endEscapeCommand();
        }
    }

    //=============================================================================
    // Scene_Battle
    //=============================================================================

    /* Overwritten function */
    Scene_Battle.prototype.createPartyCommandWindow = function () {
        this._partyCommandWindow = new Window_CustomPartyCommand();
        this._partyCommandWindow.setHandler('fight', this.commandFight.bind(this));
        this._partyCommandWindow.setHandler('escape', this.commandEscape.bind(this));
        this._partyCommandWindow.deselect();
        if (this._partyCommandWindow.layer()) {
            this.addWindow(this._partyCommandWindow);
        } else {
            this.addChild(this._partyCommandWindow);
        }

    };

    /* Overwritten function */
    Scene_Battle.prototype.createActorCommandWindow = function () {
        this._actorCommandWindow = new Window_CustomActorCommand();
        this._actorCommandWindow.setHandler('attack', this.commandAttack.bind(this));
        this._actorCommandWindow.setHandler('skill', this.commandSkill.bind(this));
        this._actorCommandWindow.setHandler('guard', this.commandGuard.bind(this));
        this._actorCommandWindow.setHandler('item', this.commandItem.bind(this));
        this._actorCommandWindow.setHandler('escape', this.commandActorEscape.bind(this));
        this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
        if (this._actorCommandWindow.layer()) {
            this.addWindow(this._actorCommandWindow);
        } else {
            this.addChild(this._actorCommandWindow);
        }
    };

    VictorEngine.BattleCommandWindow.startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
    Scene_Battle.prototype.startPartyCommandSelection = function () {
        if (this._partyCommandWindow.skip()) {
            this.selectNextCommand();
            if (BattleManager.actor()) {
                this.startActorCommandSelection();
            }
        } else {
            VictorEngine.BattleCommandWindow.startPartyCommandSelection.call(this);
        }
    };

    Scene_Battle.prototype.commandActorEscape = function () {
        BattleManager.inputtingAction().setEscape();
        this.selectNextCommand();
    };

})();

//=============================================================================
// Window_CustomPartyCommand
//=============================================================================

function Window_CustomPartyCommand() {
    this.initialize.apply(this, arguments);
}

Window_CustomPartyCommand.prototype = Object.create(Window_PartyCommand.prototype);
Window_CustomPartyCommand.prototype.constructor = Window_CustomPartyCommand;

(function () {

    Object.defineProperty(Window_CustomPartyCommand.prototype, 'frameOpacity', {
        get: function () {
            return this._windowFrameSprite.alpha * 255;
        },
        set: function (value) {
            this._windowFrameSprite.alpha = value.clamp(0, 255) / 255;
        },
        configurable: true
    });

    Window_CustomPartyCommand.prototype.initialize = function () {
        var width = this.windowWidth();
        var height = this.windowHeight();
        var boxWidth = Graphics.boxWidth;
        var boxHeight = Graphics.boxHeight;
        var wx = Math.floor(Number(eval(this.display().x))) || 0;
        var wy = Math.floor(Number(eval(this.display().y))) || 0;
        var ww = Math.floor(Number(eval(this.display().width))) || 0;
        var wh = Math.floor(Number(eval(this.display().height))) || 0;
        this.clearCommandList();
        this.makeCommandList();
        Window_Selectable.prototype.initialize.call(this, wx, wy, ww, wh);
        this.createBackground();
        this.refresh();
        this.select(0);
        this.deactivate();
        this.openness = 0;
    };

    Window_CustomPartyCommand.prototype.update = function () {
        Window_PartyCommand.prototype.update.call(this);
        this.updateBackground();
        this.updateRefresh();
    };

    Window_CustomPartyCommand.prototype.refresh = function () {
        this._refreshRequest = true;
    };

    Window_CustomPartyCommand.prototype.select = function (index) {
        Window_PartyCommand.prototype.select.call(this, index);
        this._refreshRequest = true;
    };

    Window_CustomPartyCommand.prototype.updateRefresh = function () {
        if (this._refreshRequest) {
            Window_PartyCommand.prototype.refresh.call(this);
            this._refreshRequest = false;
        }
    };

    Window_CustomPartyCommand.prototype.updateBackOpacity = function () {
        this.backOpacity = Number(eval(this.display().backOpacity)) || 0;
        this.frameOpacity = Number(eval(this.display().frameOpacity)) || 0;
    };

    Window_CustomPartyCommand.prototype.display = function () {
        return VictorEngine.BattleCommandWindow.party;
    };

    Window_CustomPartyCommand.prototype.face = function () {
        return VictorEngine.BattleCommandWindow.face;
    };

    Window_CustomPartyCommand.prototype.picture = function () {
        return VictorEngine.BattleCommandWindow.picture;
    };

    Window_CustomPartyCommand.prototype.skip = function () {
        return this.display().skip;
    };

    Window_CustomPartyCommand.prototype.selected = function () {
        return this.display().active;
    };

    Window_CustomPartyCommand.prototype.content = function () {
        return this.display().content;
    };

    Window_CustomPartyCommand.prototype.layer = function () {
        return this.display().layer;
    };

    Window_CustomPartyCommand.prototype.isActive = function (index) {
        return this._index === index;
    };

    Window_CustomPartyCommand.prototype.numVisibleRows = function () {
        return Math.floor(Number(eval(this.display().lines))) || 1;
    };

    Window_CustomPartyCommand.prototype.maxCols = function () {
        return Math.floor(Number(eval(this.display().columns))) || 1;
    };

    Window_CustomPartyCommand.prototype.itemWidth = function () {
        return Math.floor((this.width - this.padding * 2) / this.maxCols());
    };

    Window_CustomPartyCommand.prototype.itemHeight = function () {
        return Math.floor((this.height - this.padding * 2) / this.numVisibleRows());
    };

    Window_CustomPartyCommand.prototype.createBackground = function () {
        this._background = new Sprite();
        this._windowSpriteContainer.addChildAt(this._background, 0);
    };

    Window_CustomPartyCommand.prototype.updateBackground = function () {
        if (this.display().background && this._background) {
            if (!this._background.bitmap) {
                this._background.bitmap = ImageManager.loadSystem(this.display().background);
                this._background.bitmap.addLoadListener(this.updateBackgroundFrame.bind(this));
            }
            this._background.x = Math.floor(this.display().backgroundX);
            this._background.y = Math.floor(this.display().backgroundY);
            this._background.visible = this.visible && this.isOpen();
            this._background.opacity = this.opacity;
        }
    };

    Window_CustomPartyCommand.prototype.updateBackgroundFrame = function () {
        var width = this._background.bitmap.width;
        var height = this._background.bitmap.height;
        this._background.setFrame(0, 0, width, height);
    };

    Window_CustomPartyCommand.prototype.setupItemRect = function (index) {
        var rect = this.itemRect(index);
        var offsetX = Number(eval(this.content().x));
        var offsetY = Number(eval(this.content().y));
        var actionX = this.isActive(index) ? Number(eval(this.selected().x)) : 0;
        var actionY = this.isActive(index) ? Number(eval(this.selected().y)) : 0;
        rect.x += Math.floor(offsetX + actionX);
        rect.y += Math.floor(offsetY + actionY);
        return rect;
    };

    Window_CustomPartyCommand.prototype.itemRect = function (index) {
        var horz = 0;
        var vert = 0;
        var rect = new Rectangle();
        var rows = this.numVisibleRows();
        var cols = this.maxCols();
        var cw = this.contents.width;
        var ch = this.contents.height;
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        if (this.display().horizontal) {
            var max = this.maxItems() - cols * Math.floor(index / cols);
            if (max < cols) {
                horz = Math.floor(cw / 2 - rect.width * max / 2);
            }
        }
        if (this.display().vertical) {
            var max = this.maxItems() - rows * Math.floor(index / rows);
            if (max < rows) {
                vert = Math.floor(ch / 2 - rect.height * max / 2);
            }
        }
        var row = cols === 1 ? Math.floor(index / cols) : Math.floor(index / cols) % rows;
        rect.x = index % cols * rect.width + horz - this._scrollX;
        rect.y = row * rect.height + vert - this._scrollY;
        return rect;
    };

    Window_CustomPartyCommand.prototype.drawItem = function (index) {
        var rect = this.setupItemRect(index);
        this.drawBackArea(rect, index);
        this.drawTextArea(rect, index);
    };

    Window_CustomPartyCommand.prototype.drawBackArea = function (rect, index) {
        var name;
        if (this.selected().back && this.isActive(index)) {
            var ox = Math.floor(Number(eval(this.selected().backX)));
            var oy = Math.floor(Number(eval(this.selected().backY)));
            var name = this.selecting().back;
        } else if (this.content().back) {
            var ox = Math.floor(Number(eval(this.content().backX)));
            var oy = Math.floor(Number(eval(this.content().backY)));
            var name = this.content().back;
        }
        if (name) {
            var bitmap = ImageManager.loadSystem(name);
            this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, rect.x + ox, rect.y + oy);
            if (!bitmap.isReady()) {
                bitmap.addLoadListener(this.refresh.bind(this));
            }
        }
    };

    Window_CustomPartyCommand.prototype.drawTextArea = function (rect, index) {
        var align = this.itemTextAlign();
        this.changePaintOpacity(this.isCommandEnabled(index));
        if (this.isActive(index)) {
            var color = eval(this.getFontColor(this.selected().color || this.content().color));
            var font = eval(this.selected().font || this.content().font);
            var size = eval(this.selected().size || this.content().size);
        } else {
            var color = eval(this.getFontColor(this.content().color));
            var font = eval(this.content().font);
            var size = eval(this.content().size);
        }
        var ox = Math.floor(Number(eval(this.content().textX)));
        var oy = Math.floor(Number(eval(this.content().textY)));
        this.changeTextColor(color);
        this.contents.fontFace = font;
        this.contents.fontSize = Math.floor(size);
        this.drawText(this.commandName(index), rect.x + ox, rect.y + oy, rect.width, align);
    };

    Window_CustomPartyCommand.prototype.itemTextAlign = function () {
        return this.display().textAlign.toLowerCase() || 'left';
    };

})();

//=============================================================================
// Window_CustomActorCommand
//=============================================================================

function Window_CustomActorCommand() {
    this.initialize.apply(this, arguments);
}

Window_CustomActorCommand.prototype = Object.create(Window_ActorCommand.prototype);
Window_CustomActorCommand.prototype.constructor = Window_CustomActorCommand;

(function () {

    Object.defineProperty(Window_CustomActorCommand.prototype, 'frameOpacity', {
        get: function () {
            return this._windowFrameSprite.alpha * 255;
        },
        set: function (value) {
            this._windowFrameSprite.alpha = value.clamp(0, 255) / 255;
        },
        configurable: true
    });

    Window_CustomActorCommand.prototype.initialize = function () {
        this.clearCommandList();
        this.makeCommandList();
        Window_Selectable.prototype.initialize.call(this, 0, 0, 0, 0);
        this.createBackground();
        this.createPicture();
        this.refresh();
        this.select(0);
        this.deactivate();
        this._actor = null;
        this.openness = 0;
    };

    Window_CustomActorCommand.prototype.update = function () {
        Window_ActorCommand.prototype.update.call(this);
        this.updateBackground();
        this.updatePicture();
        this.updateRefresh();
    };

    Window_CustomActorCommand.prototype.refresh = function () {
        this._refreshRequest = true;
    };

    Window_CustomActorCommand.prototype.select = function (index) {
        Window_ActorCommand.prototype.select.call(this, index);
        this._refreshRequest = true;
    };

    Window_CustomActorCommand.prototype.updateRefresh = function () {
        if (this._refreshRequest) {
            Window_ActorCommand.prototype.refresh.call(this);
            this._refreshRequest = false;
        }
    };

    Window_CustomActorCommand.prototype.updateBackOpacity = function () {
        this.backOpacity = Number(eval(this.display().backOpacity)) || 0;
        this.frameOpacity = Number(eval(this.display().frameOpacity)) || 0;
    };

    Window_CustomActorCommand.prototype.refresh = function () {
        this.refreshPositions();
        Window_ActorCommand.prototype.refresh.call(this);
    };

    Window_CustomActorCommand.prototype.makeCommandList = function () {
        Window_ActorCommand.prototype.makeCommandList.call(this)
        if (this._actor && this.display().escape) {
            this.addEscapeCommand();
        }
    };

    Window_CustomActorCommand.prototype.drawAllItems = function () {
        this.drawFaceArea();
        Window_Selectable.prototype.drawAllItems.call(this);
    };

    Window_CustomActorCommand.prototype.addEscapeCommand = function () {
        this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
    };

    Window_CustomActorCommand.prototype.display = function () {
        return VictorEngine.BattleCommandWindow.actor;
    };

    Window_CustomActorCommand.prototype.face = function () {
        return VictorEngine.BattleCommandWindow.face;
    };

    Window_CustomActorCommand.prototype.picture = function () {
        return VictorEngine.BattleCommandWindow.picture;
    };

    Window_CustomActorCommand.prototype.selected = function () {
        return this.display().active;
    };

    Window_CustomActorCommand.prototype.content = function () {
        return this.display().content;
    };

    Window_CustomActorCommand.prototype.escape = function () {
        return this.display().escape;
    };

    Window_CustomActorCommand.prototype.layer = function () {
        return this.display().layer;
    };

    Window_CustomActorCommand.prototype.isActive = function (index) {
        return this._index === index;
    };

    Window_CustomActorCommand.prototype.createBackground = function () {
        this._background = new Sprite();
        this._windowSpriteContainer.addChildAt(this._background, 0);
    };

    Window_CustomActorCommand.prototype.numVisibleRows = function () {
        return Math.floor(Number(eval(this.display().lines))) || 1;
    };

    Window_CustomActorCommand.prototype.maxCols = function () {
        return Math.floor(Number(eval(this.display().columns))) || 1;
    };

    Window_CustomActorCommand.prototype.itemWidth = function () {
        return Math.floor((this.width - this.padding * 2) / this.maxCols());
    };

    Window_CustomActorCommand.prototype.itemHeight = function () {
        return Math.floor((this.height - this.padding * 2) / this.numVisibleRows());
    };

    Window_CustomActorCommand.prototype.createPicture = function () {
        this._picture = new Sprite();
        this._picture.anchor.x = 0.5;
        this._picture.anchor.y = 1;
        this._windowSpriteContainer.addChild(this._picture);
    };

    Window_CustomActorCommand.prototype.updateBackground = function () {
        if (this.display().background && this._background) {
            if (!this._background.bitmap) {
                this._background.bitmap = ImageManager.loadSystem(this.display().background);
                this._background.bitmap.addLoadListener(this.updateBackgroundFrame.bind(this));
            }
            this._background.x = Math.floor(this.display().backgroundX);
            this._background.y = Math.floor(this.display().backgroundY);
            this._background.visible = this.visible && this.isOpen();
            this._background.opacity = this.opacity;
        }
    };

    Window_CustomActorCommand.prototype.updatePicture = function () {
        if (this._picture && this._actor && this._actor.commandPicture()) {
            if (!this._picture.bitmap || this._pictureActor !== this._actor) {
                this._pictureActor = this._actor;
                this._picture.bitmap = ImageManager.loadPicture(this._actor.commandPicture());
                this._picture.bitmap.addLoadListener(this.updatePictureFrame.bind(this));
            }
            this._picture.x = Math.floor(this.picture().x);
            this._picture.y = Math.floor(this.picture().y) + this.height;
            this._picture.visible = this.visible && this.isOpen();
            this._picture.opacity = this.opacity;
        }
    };

    Window_CustomActorCommand.prototype.updateBackgroundFrame = function () {
        var width = this._background.bitmap.width;
        var height = this._background.bitmap.height;
        this._background.setFrame(0, 0, width, height);
    };

    Window_CustomActorCommand.prototype.updatePictureFrame = function () {
        var width = this._picture.bitmap.width;
        var height = this._picture.bitmap.height;
        this._picture.setFrame(0, 0, width, height);
    };

    Window_CustomActorCommand.prototype.refreshPositions = function () {
        var actor = this._actor;
        var index = $gameParty.battleMembers().indexOf(actor);
        var screenX = actor ? actor.screenX : 0;
        var screenY = actor ? actor.screenY : 0;
        var width = this.windowWidth();
        var height = this.windowHeight();
        var boxWidth = Graphics.boxWidth;
        var boxHeight = Graphics.boxHeight;
        var wx = Math.floor(Number(eval(this.display().x))) || 0;
        var wy = Math.floor(Number(eval(this.display().y))) || 0;
        var ww = Math.floor(Number(eval(this.display().width))) || 0;
        var wh = Math.floor(Number(eval(this.display().height))) || 0;
        this.move(wx, wy, ww, wh);
        this.createContents();
    };

    Window_CustomActorCommand.prototype.setupItemRect = function (index, actor) {
        var rect = this.itemRect(index);
        var x = this.isActive(index) ? Number(eval(this.selected().x)) : 0;
        var y = this.isActive(index) ? Number(eval(this.selected().y)) : 0;
        rect.x += Math.floor(x);
        rect.y += Math.floor(y);
        return rect;
    };

    Window_CustomActorCommand.prototype.itemRect = function (index) {
        var horz = 0;
        var vert = 0;
        var rect = new Rectangle();
        var rows = this.numVisibleRows();
        var cols = this.maxCols();
        var cw = this.contents.width;
        var ch = this.contents.height;
        var cx = Number(eval(this.content().x));
        var cy = Number(eval(this.content().y));
        rect.width = this.itemWidth();
        rect.height = this.itemHeight();
        if (this.display().horizontal) {
            var max = this.maxItems() - cols * Math.floor(index / cols);
            if (max < cols) {
                horz = Math.floor(cw / 2 - rect.width * max / 2);
            }
        }
        if (this.display().vertical) {
            var max = this.maxItems() - rows * Math.floor(index / rows);
            if (max < rows) {
                vert = Math.floor(ch / 2 - rect.height * max / 2);
            }
        }
        var row = cols === 1 ? Math.floor(index / cols) : Math.floor(index / cols) % rows;
        rect.x = index % cols * rect.width + horz + cx - this._scrollX;
        rect.y = row * rect.height + vert + cy - this._scrollY;
        return rect;
    };

    Window_CustomActorCommand.prototype.drawItem = function (index) {
        var actor = this._actor;
        var rect = this.setupItemRect(index, actor);
        this.drawBackArea(rect, index, actor);
        this.drawTextArea(rect, index, actor);
    };

    Window_CustomActorCommand.prototype.drawBackArea = function (rect, index, actor) {
        var name;
        if (this.selected().back && this.isActive(index)) {
            var ox = Math.floor(Number(eval(this.selected().backX)));
            var oy = Math.floor(Number(eval(this.selected().backY)));
            var name = this.selecting().back;
        } else if (this.content().back) {
            var ox = Math.floor(Number(eval(this.content().backX)));
            var oy = Math.floor(Number(eval(this.content().backY)));
            var name = this.content().back;
        }
        if (name) {
            var bitmap = ImageManager.loadSystem(name);
            this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, rect.x + ox, rect.y + oy);
            if (!bitmap.isReady()) {
                bitmap.addLoadListener(this.refresh.bind(this));
            }
        }
    };

    Window_CustomActorCommand.prototype.drawFaceArea = function () {
        if (this._actor && this.face().show) {
            var ox = Math.floor(Number(eval(this.face().x)));
            var oy = Math.floor(Number(eval(this.face().y)));
            var fw = Math.floor(Number(eval(this.face().width)));
            var fh = Math.floor(Number(eval(this.face().height)));
            var faceName = this._actor.faceName() + this.face().sufix;
            var faceIndex = this._actor.faceIndex();
            this.drawFace(faceName, faceIndex, ox, oy, fw, fh);
            var bitmap = ImageManager.loadFace(faceName);
            if (!bitmap.isReady()) {
                bitmap.addLoadListener(this.refresh.bind(this));
            }
        }
    };

    Window_CustomActorCommand.prototype.drawTextArea = function (rect, index, actor) {
        var align = this.itemTextAlign();
        this.changePaintOpacity(this.isCommandEnabled(index));
        if (this.isActive(index)) {
            var color = eval(this.getFontColor(this.selected().color || this.content().color));
            var font = eval(this.selected().font || this.content().font);
            var size = eval(this.selected().size || this.content().size);
        } else {
            var color = eval(this.getFontColor(this.content().color));
            var font = eval(this.content().font);
            var size = eval(this.content().size);
        }
        var ox = Math.floor(Number(eval(this.content().textX))) || 0;
        var oy = Math.floor(Number(eval(this.content().textY))) || 0;
        this.changeTextColor(color);
        this.contents.fontFace = font;
        this.contents.fontSize = Math.floor(size);
        this.drawText(this.commandName(index), rect.x + ox, rect.y + oy, rect.width, align);
    };

    Window_CustomActorCommand.prototype.itemTextAlign = function () {
        return this.display().textAlign.toLowerCase() || 'left';
    };

})();