/*
 * ==============================================================================
 * ** Victor Engine MV - Custom Vehicles
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.02.05 > First release.
 *  v 1.01 - 2016.02.05 > Added 'switch' option to vehicles.
 *  v 1.02 - 2016.03.02 > Added terrain tag setup to custom vehicles.
 *                      > Fixed issue with boarding normal vehicles.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Custom Vehicles'] = '1.02';

var VictorEngine = VictorEngine || {};
VictorEngine.CustomVehicles = VictorEngine.CustomVehicles || {};

(function () {

	VictorEngine.CustomVehicles.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.CustomVehicles.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Custom Vehicles', 'VE - Basic Module', '1.10');
	};

	VictorEngine.CustomVehicles.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.CustomVehicles.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.02 - Adds new vehicles besides the 3 default ones.
 * @author Victor Sant
 *
 * @param Vehicle Setup Event
 * @desc Common Event called at the new game to stup the new
 * vehicles.	Common Event Id.
 * @default 1
 *
 * @help 
 * ------------------------------------------------------------------------------
 * Common Event Notetags:
 * ------------------------------------------------------------------------------
 *
 *  <vehicle: 'type'>
 *   charset: 'filename', index
 *   initial map: id, X, Y
 *   character above
 *   idle animation
 *   step animation
 *   altitude: X
 *   speed: X
 *   passability: X
 *   switch: X
 *   passable region: X[, X...]
 *   landing region: X[, X...]
 *   boarding region: X[, X...]
 *   passable terrain: X[, X...]
 *   landing terrain: X[, X...]
 *   boarding terrain: X[, X...]
 *   music: 'filename', volume, pitch
 *   encounter rate: X%
 *   encounter region: X:Y [, X:Y...] 
 *   idle sound: 'filename', volume, pitch, delay
 *   move sound: 'filename', volume, pitch, delay
 *   battleback: X:'bb1','bb2'[, X:'bb1','bb2'...]
 *  </vehicle>
 *   This tag setups the new vehicle.
 *   This setup is rather complex. it's divided on various parts.
 *   You don't need to add all the options available on the setup, add just the
 *   ones you will use, all others can be ommited.
 * 
 * ---------------
 *
 *   - Type
 *   The vehicle type is the name for the vehicle. They are used to identify the
 *   vehicle when you use the Plugin Commands. Each vehicle must have it's own
 *   name. The names 'walk', 'boat', 'ship' and 'airship' are reserved for the
 *   default vehicles/normal walk and can't be used. It's suggested that you
 *   don't use whitespaces on it. If you do, you won't be able to use Plugin
 *   Commands for that vehicle
 *     'type' : Vehicle type. Always in quotations.       
 * 
 * ---------------
 *
 *   - Charset
 *   The charset filename and index (if using a character sheet with 8 chars)
 *     'filename' : chaset filename. Always in quotations.
 *     index      : charset index. (0-8)
 * 
 * ---------------
 *
 *   - Initial Map
 *   The map and coordinates where the vehicle will be when you start a new game.
 *   If not set, you will need to use a Plugin Command to move the vehicle.
 *      id : map Id.
 *      X  : coordinate X.
 *      Y  : coordinate Y.
 * 
 * ---------------
 *
 *   - Character Above
 *   The player will need to setp above the vehicle to board on it, without the
 *   tag, the player can board the vehicle by facing it.
 * 
 * ---------------
 *
 *   - Step Animation
 *   The vehilce will show steping animation when idle while driving. If not set
 *   the vehicle will have animation only when moving.
 * 
 * ---------------
 *
 *   - idle Animation
 *   The vehilce will show steping animation when not being drive and when idle.
 *   If not set the vehicle will have animation only when moving or if ilde when
 *   having the 'idle animation' tag.
 * 
 * ---------------
 *
 *   - Altitude
 *   Vehicle altitude while driving. 
 *      X : altitude height (Number higher than 0)
 * 
 * ---------------
 *
 *   - Speed
 *   Vehicle move speed while driving. 
 *      X : move speed (Number higher than 0)
 * 
 * ---------------
 *
 *   - Passability
 *   Passability inheritance. The vehicle will inherit the passaibility settings
 *   from the object set. Without this, the passability will be based only on the
 *   region tiles.
 *      X : object type (player, boat, ship, airship)
 * 
 * ---------------
 *
 *   - Switch
 *   Switch turned ON while the driving the vehicle. It will be turned OFF when
 *   leaving the vehicle.
 *      X : switch Id.
 * 
 * ---------------
 *
 *   - Passable Regions
 *   Regions where the vehicle can pass through. Regions not listed will be
 *   always blocked, no matter the passability setting of the tile. The
 *   region id 0 is used to define any tile without a region.
 *   If not set, the passability will be based on terrain or the ones inherited
 *   from the basic vehicles.
 *      X : region Id.
 *      You can add as many values you want, separation them with comma.
 * 
 * ---------------
 *
 *   - Landing Regions
 *   Regions where the player can get off from the vehicle. The player will not
 *   be able to get off the vehicle on regions other than the ones list. The
 *   region id 0 is used to define any tile without a region.
 *   If not set, there will be no restriction for landing based on regions.
 *      X : region Id.
 *      You can add as many values you want, separation them with comma.
 * 
 * ---------------
 *
 *   - Boarding Regions
 *   Regions where the player can get aboard the vehicle. The player will not
 *   be able to get on the vehicle on regions other than the ones list. The
 *   region id 0 is used to define any tile without a region.
 *   If not set, there will be no restriction for boarding based on regions.
 *      X : region Id. 
 *      You can add as many values you want, separation them with comma.
 * 
 * ---------------
 *
 *   - Passable Terrains
 *   Terrains where the vehicle can pass through. Terrains not listed will be
 *   always blocked, no matter the passability setting of the tile. The
 *   terrain tag 0 is used to define any tile without a terrain.
 *   If not set, the passability will be based on regions or the ones inherited
 *   from the basic vehicles.
 *      X : terrain tag.
 *      You can add as many values you want, separation them with comma.
 * 
 * ---------------
 *
 *   - Landing Terrains
 *   Terrains where the player can get off from the vehicle. The player will not
 *   be able to get off the vehicle on terrains other than the ones list. The
 *   terrain tag 0 is used to define any tile without a terrain.
 *   If not set, there will be no restriction for landing based on terrains.
 *      X : terrain tag.
 *      You can add as many values you want, separation them with comma.
 * 
 * ---------------
 *
 *   - Boarding Terrains
 *   Terrains where the player can get aboard the vehicle. The player will not
 *   be able to get on the vehicle on terrains other than the ones list. The
 *   terrain tag 0 is used to define any tile without a terrain.
 *   If not set, there will be no restriction for boarding based on terrains.
 *      X : terrain tag. 
 *      You can add as many values you want, separation them with comma.
 * 
 * ---------------
 *
 *   - Music
 *   Backgroun music played while driving. If not set the background music
 *   playing will not change.
 *      'filename' : BGM filename. Always in quotations.
 *      volume     : BGM volume. (0-100)
 *      pitch      : BGM pitch.  (50-150)
 *      pan        : BGM pan.    (0-100, can be negative)
 * 
 * ---------------
 *
 *   - Idle Sound
 *   Sound effect played repeatdely while driving and the vehicle is idle. 
 *   If not set, no sound will be played.
 *      'filename' : SE filename. Always in quotations.
 *      volume     : SE volume. (0-100)
 *      pitch      : SE pitch.  (50-150)
 *      pan        : SE pan.    (0-100, can be negative)
 *      delay      : interval, in frames, for the sound be played.
 *                 (low delay values might cause lag depending on the sound file)
 * 
 * ---------------
 *
 *   - Move Sound
 *   Sound effect played repeatdely while driving and the vehicle is moving. 
 *   If not set, no sound will be played.
 *      'filename' : SE filename. Always in quotations.
 *      volume     : SE volume. (0-100)
 *      pitch      : SE pitch.  (50-150)
 *      pan        : SE pan.    (0-100, can be negative)
 *      delay      : interval, in frames, for the sound be played.
 *                 (low delay values might cause lag depending on the sound file)
 * 
 * ---------------
 *
 *   - Encounter Rate
 *   Battle Encounter rate while driving. This value is a % value that is 
 *   multiplied by the current encounter rate. So a value of 100% means no change
 *   on the encounter rate, 50% halves the encounter rate and 0% means no
 *   encounter. If not set, the encounter rate will be not changed.
 *      X : Encounter rate. 
 * 
 * ---------------
 *
 *   - Encounter Region
 *   Replace the enemies from one region with another region while driving the
 *   vehicle. You need to set the old region and new region Ids. The region id 0 
 *   is considered the default and will be used for tiles without region or
 *   regions without a setup.
 *      X : old region Id.
 *      Y : new region Id.
 *      You can add as many values you want, separation them with comma.
 *        Ex.: 0:2, 1:3, 4:6
 * 
 * ---------------
 *
 *   - Battleback
 *   Replace the battleback of a region while driving the vehicle. You need
 *   to set the region Id and the two battlebacks names. The region id 0 is
 *   considered the default and will be used for tiles without region or regions 
 *   without a setup.
 *      X : region Id.
 *      'bb1' : battleback 1 filename. Always in quotations.
 *      'bb2' : battleback 2 filename. Always in quotations.
 *      You can add as many values you want, separation them with comma.
 *        Ex.: 0:'Ship','Clouds' , 1:'Ship','Sky', 2:'Sky',''
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
 *  SetVehicleLocation type mapId X Y
 *    Move the vehicle to a new location
 *      type  : the vehicle type.
 *      mapId : Id of the map.
 *      X     : coordinate X.
 *      Y     : coordinate Y.
 *    You can use v[id] for the numeric values to get the value from a variable.
 * 
 * ---------------
 *
 *  ChangeVehicleImage type name index
 *    Changes the charset graphic of the vehicle
 *      type  : the vehicle type.
 *      name  : charset filename.
 *      index : charset index. (0-8)
 * 
 * ---------------
 *
 *  ChangeVehicleBGM type name volume pitch pan
 *    Changes the charset graphic of the vehicle
 *      type   : the vehicle type.
 *      name   : BGM filename. Always in quotations.
 *      volume : BGM volume. (0-100) 
 *      pitch  : BGM pitch.  (50-150)
 *      pan    : BGM pan.    (0-100, can be negative)
 *    You can use v[id] for the numeric values to get the value from a variable.
 *
 * ------------------------------------------------------------------------------
 * Additional Information:
 * ------------------------------------------------------------------------------
 * 
 *  - Creating new vehicles
 *  To create a vehicle, first you need to setup the Plugin Paramater
 *  'Vehicle Setup Event'. This parameter is the Id of a common event that will
 *  store the comments that creates the vehicles. The vehicle settings are
 *  all done inside comments.
 * 
 *  Once the parameter is set, go to the common event that you defined on it.
 *  You must create a comment tag using the tags listed above. You need to add
 *  only the values that you will actually use. 
 *
 *  You can split the notetag setup as long all the settings are inside the
 *  <vehicle> tags.
 *
 *  Don't forget to setup the map regions to match the settings you've made for
 *  the vehicles.
 *
 * ------------------------------------------------------------------------------
 * Example Comment Tags:
 * ------------------------------------------------------------------------------
 *
 * <vehicle: 'ballon'>
 *  charset: 'Vehicle', 2
 *  initial map: 1, 5, 6
 *  step animation
 *  character above
 *  altitude: 36
 *  speed: 5
 *  passable region: 0, 1, 2
 *  landing region: 0
 *  encounter rate: 0%
 * </vehicle>
 *
 * ---------------
 *
 * <vehicle: 'PortOnlyShip'>
 *  charset: 'Vehicle', 1
 *  initial map: 3, 10, 7
 *  speed: 5
 *  passability: ship
 *  landing region: 1
 *  boarding region: 1
 *  encounter rate: 50%
 *  encounter region: 0:2
 *  battleback: 0:'Ship','Ship'
 * </vehicle>
 *
 * ------------------------------------------------------------------------------
 */
/*:ja
 * @plugindesc v1.02 乗り物の詳細設定ができ、デフォルトの3台以外にも追加できます
 * @author Victor Sant
 *
 * @param Vehicle Setup Event
 * @text 乗り物設定コモンイベント
 * @type common_event
 * @desc ニューゲームで乗り物の設定を行うコモンイベントID
 * @default 1
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/custom-vehicles/
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
 * コモンイベントの注釈タグ
 * ---------------------------------------------------------------------------
 *
 *  <vehicle: 'type'>
 *   charset: 'filename', index
 *   initial map: id, X, Y
 *   character above
 *   idle animation
 *   step animation
 *   altitude: X
 *   speed: X
 *   passability: X
 *   switch: X
 *   passable region: X[, X...]
 *   landing region: X[, X...]
 *   boarding region: X[, X...]
 *   passable terrain: X[, X...]
 *   landing terrain: X[, X...]
 *   boarding terrain: X[, X...]
 *   music: 'filename', volume, pitch
 *   encounter rate: X%
 *   encounter region: X:Y [, X:Y...]
 *   idle sound: 'filename', volume, pitch, delay
 *   move sound: 'filename', volume, pitch, delay
 *   battleback: X:'bb1','bb2'[, X:'bb1','bb2'...]
 *  </vehicle>
 *
 * このタグで乗り物の設定を行います。
 * この設定はかなり複雑で、様々なパーツに分かれています。
 * 全てのオプションを追加する必要はなく、自分が使うものだけを追加して、
 * 他は全て省略できます。
 *
 * ---------------
 *
 *   - Type
 * 乗り物のタイプは、乗り物のシンボル名です。
 * これらは、プラグインコマンドを使用する時、
 * 乗り物を識別するために使用されます。
 * 各乗り物にはそれぞれシンボル名を付ける必要があります。
 * 'walk'、'boat'、'ship'、'airship'というシンボル名は、
 * デフォルトの乗り物/通常の歩行に予約されており、使用することはできません。
 * その上で空白を入れないことを推奨します。
 * 入れると、その乗り物ではプラグインコマンドが使えなくなります。
 *     'type' : 乗り物のシンボル名。('で囲う)
 *
 * ---------------
 *
 *   - Charset
 * キャラセットファイル名とインデックス
 * (8キャラのキャラシートを使用している場合)
 *     'filename' : キャラセットファイル名 ('で囲う)
 *     index      : キャラセットインデックス (0-8)
 *
 * ---------------
 *
 *   - Initial Map
 * 新しいゲームを開始した時のマップと乗り物の位置座標です。
 * 設定されていない場合、
 * プラグインコマンドを使用して乗り物を移動する必要があります。
 *      id : マップID
 *      X  : X座標
 *      Y  : Y座標
 *
 * ---------------
 *
 *   - Character Above
 * プレイヤーが乗るためには乗り物の上に移動する必要があります。
 * タグなしで、プレイヤーは直面することによって、
 * 乗り物に乗ることができます。
 *
 * ---------------
 *
 *   - Step Animation
 * 乗り物は運転中のアイドル時に足踏みアニメーションを表示します。
 * セットされていなければ、動く時だけ動きがあります。
 *
 * ---------------
 *
 *   - idle Animation
 * 乗り物は運転されていない時、休止している時、段階的な動きをします。
 * 設定されていない場合、乗り物は移動時にのみアニメーションするか、
 * 'idle animation'タグがある場合、足踏みアニメーションをします。
 *
 * ---------------
 *
 *   - Altitude
 * 移動中の乗り物の高さ。
 *      X : 高さ (0より大きい数値)
 *
 * ---------------
 *
 *   - Speed
 * 移動中の乗り物の移動速度。
 *      X : 移動速度 (0より大きい数値)
 *
 * ---------------
 *
 *   - Passability
 * オブジェクトセットから通行可能な設定を継承します。
 * これがなければ通行可能なものは、リージョンタイルのみを基準とします。
 *      X : オブジェクトシンボル名 (player, boat, ship, airship)
 *
 * ---------------
 *
 *   - Switch
 * 移動中はスイッチをONにします。
 * 降りるとOFFにします。
 *      X : スイッチID
 *
 * ---------------
 *
 *   - Passable Regions
 * 乗り物が通行可能なリージョン。
 * リストされていないリージョンは、タイルの通行設定に関わらず、
 * 常にブロックされます。
 * リージョンID0は、リージョンのないタイルを定義するために使用されます。
 * 設定されていない場合、
 * 通行設定は地形や基本的な乗り物から継承されたものになります。
 *      X : リージョンID
 *      カンマ区切りで値を追加できます。
 *
 * ---------------
 *
 *   - Landing Regions
 * プレーヤーが乗り物から降りられるリージョン。
 * リストされたリージョン以外のリージョンでは、
 * プレイヤーは乗り物から降りられません。
 * リージョンID0は、リージョンのない任意のタイルを定義するために使用されます。
 * 設定されていない場合、リージョンに基づく着陸の制限はありません。
 *      X : リージョンID
 *      カンマ区切りで値を追加できます。
 *
 * ---------------
 *
 *   - Boarding Regions
 * プレーヤーが乗り物に乗ることができるリージョン。
 * リストされたもの以外のリージョンでは、
 * プレイヤーは乗り物に乗ることができません。
 * リージョンID0は、リージョンのないタイルを定義するのに使用されます。
 * 設定されていない場合、リージョンに基づく制限はありません。
 *      X : リージョンID
 *      カンマ区切りで値を追加できます。
 *
 * ---------------
 *
 *   - Passable Terrains
 * 乗り物が通行可能な地形。
 * リストされていない地形は、タイルの通行設定に関わらず、
 * 常にブロックされます。
 * 地形タグ0は、地形のないタイルを定義するために使用されます。
 * 設定されていない場合、
 * 通行設定は地形や基本的な乗り物から継承されたものになります。
 *      X : 地形タグ
 *      カンマ区切りで値を追加できます。
 *
 * ---------------
 *
 *   - Landing Terrains
 * 乗り物から降りることができる地形。
 * リストされている以外の地形では、
 * プレイヤーは乗り物から降りられません。
 * 地形タグ0は、地形のない任意のタイルを定義するために使用されます。
 * 設定されていない場合、地形に基づく制限はありません。
 *      X : 地形タグ
 *      カンマ区切りで値を追加できます。
 *
 * ---------------
 *
 *   - Boarding Terrains
 * プレイヤーが乗り物に乗れる地形。
 * リスト以外の地形では、
 * プレイヤーは乗り物に乗ることができません。
 * 地形タグ0は、地形のないタイルを定義するために使用されます。
 * 設定されていない場合、地形に基づく制限はありません。
 *      X : 地形タグ
 *      カンマ区切りで値を追加できます。
 *
 * ---------------
 *
 *   - Music
 * 運転中に再生されるBGMを設定します。
 * 設定していない場合、再生しているBGMは変わりません。
 *      'filename' : BGMファイル名 ('で囲う)
 *      volume     : BGM音量 (0-100)
 *      pitch      : BGMピッチ  (50-150)
 *      pan        : BGMパン    (0-100, 正負の値)
 *
 * ---------------
 *
 *   - Idle Sound
 * 停止状態で効果音を繰り返し再生します。
 * 設定されていない場合、音は鳴りません。
 *      'filename' : SEファイル名 ('で囲う)
 *      volume     : SE音量 (0-100)
 *      pitch      : SEピッチ  (50-150)
 *      pan        : SEパン    (0-100, 正負の値)
 *      delay      : 音が再生される間隔をフレーム単位で指定します。
 *                 (間隔の値が低いとラグが発生する場合があります)
 *
 * ---------------
 *
 *   - Move Sound
 * 乗り物が移動している時、効果音を繰り返し再生します。
 * 設定されていない場合、音は鳴りません。
 *      'filename' : SEファイル名 ('で囲う)
 *      volume     : SE音量 (0-100)
 *      pitch      : SEピッチ  (50-150)
 *      pan        : SEパン    (0-100, 正負の値)
 *      delay      : 音が再生される間隔をフレーム単位で指定します。
 *                 (間隔の値が低いとラグが発生する場合があります)
 *
 * ---------------
 *
 *   - Encounter Rate
 * 移動中のエンカウント率。
 * この値は、現在のエンカウント率を掛け合わせた%の値です。
 * つまり、値が100%の場合はエンカウント率に変化がないことを意味し、
 * 50%の場合はエンカウント率が半分になり、
 * 0%の場合はエンカウントしないことを意味します。
 * 設定されていない場合、エンカウント率は変更されません。
 *      X : エンカウント率
 *
 * ---------------
 *
 *   - Encounter Region
 * あるリージョンの敵グループを別のリージョンと入れ替えます。
 * 古いリージョンと新しいリージョンのIDを設定する必要があります。
 * リージョンID0がデフォルトとされ、
 * リージョンのないタイルや設定のないリージョンに使用されます。
 *      X : 古いリージョンID
 *      Y : 新しいリージョンID
 *      カンマ区切りで値を追加できます。
 *        例 : 0:2, 1:3, 4:6
 *
 * ---------------
 *
 *   - Battleback
 * リージョンの戦闘背景を入れ替えます。
 * リージョンIDと2つの戦闘背景名を設定する必要があります。
 * リージョンID0がデフォルトとされ、
 * リージョンのないタイルや設定のないリージョンに使用されます。
 *      X : リージョンID
 *      'bb1' : 戦闘背景1ファイル名 ('で囲う)
 *      'bb2' : 戦闘背景2ファイル名 ('で囲う)
 *      カンマ区切りで値を追加できます。
 *        例 : 0:'Ship','Clouds' , 1:'Ship','Sky', 2:'Sky',''
 *
 * ---------------------------------------------------------------------------
 *  プラグインコマンド
 * ---------------------------------------------------------------------------
 *
 * 数値の代わりにv[id]を使用して、idが設定された変数から値を取得できます。
 * 例えば、v[3]は変数ID3から値を取得します。
 *
 * ---------------
 *
 *  SetVehicleLocation type mapId X Y
 *    乗り物を新しい場所に移動させる
 *      type  : 乗り物のシンボル名
 *      mapId : マップID
 *      X     : X座標
 *      Y     : Y座標
 *    数値にはv[id]を使用して、変数から値を取得できます。
 *
 * ---------------
 *
 *  ChangeVehicleImage type name index
 *    乗り物のキャラセットの画像を変更します。
 *      type  : 乗り物のシンボル名
 *      name  : キャラセットファイル名
 *      index : キャラセットインデックス (0-8)
 *
 * ---------------
 *
 *  ChangeVehicleBGM type name volume pitch pan
 *    乗り物のBGMを変更します。
 *      type   : 乗り物のシンボル名
 *      name   : BGMファイル名 ('で囲う)
 *      volume : BGM音量 (0-100)
 *      pitch  : BGMピッチ  (50-150)
 *      pan    : BGMパン    (0-100, 正負の値)
 *    数値にはv[id]を使用して、変数から値を取得できます。
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 *  - Creating new vehicles
 * まずプラグインのパラメーター'Vehicle Setu pEvent'を設定する必要があります。
 * このパラメータは、乗り物を作成する注釈を格納するコモンイベントのIDです。
 * 乗り物の設定は全て注釈の中で行います。
 *
 * パラメータを設定したら、定義したコモンイベントに移動します。
 * 上記のタグを使って注釈タグを作成する必要があります。
 * 実際に使用する値だけを追加する必要があります。
 *
 * 全ての設定が<vehicle>タグ内にある限り、
 * 注釈タグの設定を分割できます。
 *
 * 忘れずに、乗り物の設定に合わせてマップのリージョンを設定してください。
 *
 * ---------------------------------------------------------------------------
 * 注釈タグの例
 * ---------------------------------------------------------------------------
 *
 * <vehicle: 'ballon'>
 *  charset: 'Vehicle', 2
 *  initial map: 1, 5, 6
 *  step animation
 *  character above
 *  altitude: 36
 *  speed: 5
 *  passable region: 0, 1, 2
 *  landing region: 0
 *  encounter rate: 0%
 * </vehicle>
 *
 * ---------------
 *
 * <vehicle: 'PortOnlyShip'>
 *  charset: 'Vehicle', 1
 *  initial map: 3, 10, 7
 *  speed: 5
 *  passability: ship
 *  landing region: 1
 *  boarding region: 1
 *  encounter rate: 50%
 *  encounter region: 0:2
 *  battleback: 0:'Ship','Ship'
 * </vehicle>
 */

(function () {

	//=============================================================================
	// Parameters
	//=============================================================================

	if (Imported['VE - Basic Module']) {
		var parameters = VictorEngine.getPluginParameters();
		VictorEngine.Parameters = VictorEngine.Parameters || {};
		VictorEngine.Parameters.CustomVehicles = {};
		VictorEngine.Parameters.CustomVehicles.SetupEvent = Number(parameters["Vehicle Setup Event"]) || 0;
	};

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.CustomVehicles.loadParameters = VictorEngine.loadParameters;
	VictorEngine.loadParameters = function () {
		VictorEngine.CustomVehicles.loadParameters.call(this);
		VictorEngine.CustomVehicles.processParameters();
	};

	VictorEngine.CustomVehicles.processParameters = function () {
		if (this.loaded) return;
		this.loaded = true;
		var eventId = VictorEngine.Parameters.CustomVehicles.SetupEvent;
		if (eventId) {
			var notes = VictorEngine.getPageNotes(new Game_CommonEvent(eventId));
			$dataSystem.customVehicles = {};
			VictorEngine.CustomVehicles.processNotes($dataSystem.customVehicles, notes);
		}
	};

	VictorEngine.CustomVehicles.processNotes = function (data, notes) {
		var match;
		var regex = VictorEngine.getNotesValues("vehicle:[ ]*('[^\']+'|\"[^\"]+\")[ ]*", "vehicle");
		while ((match = regex.exec(notes)) !== null) {
			var type = match[1].slice(1, -1).toLowerCase().trim();
			if (!['', 'walk', 'boat', 'ship', 'airship'].contains(type)) {
				data[type] = this.processValues(match[2], type);
			}
		};
	};

	VictorEngine.CustomVehicles.processValues = function (match, type) {
		var result = {};
		var charData = this.getCharset(match);
		var mapData = this.getInitMap(match);
		result.type = type;
		result.characterName = charData.name;
		result.characterIndex = charData.index;
		result.startMapId = mapData.id;
		result.startX = mapData.x;
		result.startY = mapData.y;
		result.bgm = this.getSound(match, 'bgm');
		result.idleSound = this.getSound(match, 'idle sound');
		result.moveSound = this.getSound(match, 'move sound');
		result.altitude = VictorEngine.getNumberValue(match, 'altitude', 0);
		result.speed = VictorEngine.getNumberValue(match, 'speed', 0);
		result.gameSwitch = VictorEngine.getNumberValue(match, 'switch', 0);
		result.passability = VictorEngine.getStringValue(match, 'passability', null);
		result.passableRegion = VictorEngine.getNumberValues(match, 'passable region');
		result.landingRegion = VictorEngine.getNumberValues(match, 'landing region');
		result.boardingRegion = VictorEngine.getNumberValues(match, 'boarding region');
		result.passableTerrain = VictorEngine.getNumberValues(match, 'passable terrain');
		result.landingTerrain = VictorEngine.getNumberValues(match, 'landing terrain');
		result.boardingTerrain = VictorEngine.getNumberValues(match, 'boarding terrain');
		result.encounterRate = VictorEngine.getNumberValue(match, 'encounter rate', 0);
		result.encounterRegion = this.getEncounterRegion(match);
		result.battleback = this.getBattleback(match);
		result.idle = !!match.match(/idle[ ]*animation/i);
		result.step = !!match.match(/step[ ]*animation/i);
		result.above = !!match.match(/character[ ]*above/i);
		return result;
	};

	VictorEngine.CustomVehicles.getCharset = function (match) {
		var regex = new RegExp("charset[ ]*:[ ]*('[^\']+'|\"[^\"]+\")(?:[ ]*,[ ]*(\\d+))?", 'gi');
		var value = regex.exec(match);
		var name = value ? value[1].slice(1, -1) : '';
		var index = value ? Number(value[2]) : 0;
		return { name: name, index: index };
	};

	VictorEngine.CustomVehicles.getInitMap = function (match) {
		var regex = new RegExp("initial map[ ]*:[ ]*(\\d+)[ ]*,[ ]*(\\d+)[ ]*,[ ]*(\\d+)", 'gi');
		var value = regex.exec(match)
		var id = value ? Number(value[1]) : 0;
		var x = value ? Number(value[2]) : 0;
		var y = value ? Number(value[3]) : 0;
		return { id: id, x: x, y: y };
	};

	VictorEngine.CustomVehicles.getSound = function (match, type) {
		var part1 = "[ ]*('[^\']+'|\"[^\"]+\")";
		var part2 = "[ ]*,[ ]*(\\d+)[ ]*,[ ]*(\\d+)[ ]*,[ ]*([+-]?\\d+)(:?[ ]*,[ ]*(\\d+))?"
		var regex = new RegExp(type + "[ ]*:" + part1 + part2, 'gi');
		var value = regex.exec(match);
		var name = value ? value[1].slice(1, -1) : '';
		var vol = value ? Number(value[2]) : 90;
		var pan = value ? Number(value[3]) : 100;
		var pitch = value ? Number(value[4]) : 0;
		var delay = value ? Number(value[4]) : 1;
		return { name: name, pan: pan, pitch: pitch, volume: vol, delay: delay };
	};

	VictorEngine.CustomVehicles.getEncounterRegion = function (match) {
		var part1 = "((?:\\d+[ ]*:[ ]*\\d+[ ]*,?[ ]*)+)"
		var regex1 = new RegExp("encounter region[ ]*:[ ]*" + part1, 'gi');
		var regex2 = new RegExp('(\\d+)[ ]*:[ ]*(\\d+)', 'gi');
		var values = regex1.exec(match);
		var notes = values ? values[1] : "";
		var result = {};
		while ((value = regex2.exec(notes)) !== null) {
			result[Number(value[1])] = Number(value[2]);
		};
		return result;
	};

	VictorEngine.CustomVehicles.getBattleback = function (match) {
		var part1 = "'[^\']+'|\"[^\"]+\""
		var part2 = "((?:\\d+[ ]*:[ ]*(?:" + part1 + ")[ ]*,[ ]*(?:" + part1 + ")[ ]*,?[ ]*)+)";
		var regex1 = new RegExp("battleback[ ]*:[ ]*" + part2, 'gi');
		var regex2 = new RegExp("(\\d+)[ ]*:[ ]*(" + part1 + "),[ ]*(" + part1 + ")", 'gi');
		var values = regex1.exec(match);
		var notes = values ? values[1] : "";
		var result = {};
		while ((value = regex2.exec(notes)) !== null) {
			var battleback1 = value[2].slice(1, -1);
			var battleback2 = value[3].slice(1, -1);
			result[Number(value[1])] = { battleback1: battleback1, battleback2: battleback2 };
		};
		return result;
	};

	//=============================================================================
	// Game_CharacterBase
	//=============================================================================

	VictorEngine.CustomVehicles.isCollidedWithVehicles = Game_CharacterBase.prototype.isCollidedWithVehicles;
	Game_CharacterBase.prototype.isCollidedWithVehicles = function (x, y) {
		return (VictorEngine.CustomVehicles.isCollidedWithVehicles.call(this, x, y) ||
			$gameMap.isCollidedWithCustomVehicles(x, y));
	};

	//=============================================================================
	// Game_Player
	//=============================================================================

	VictorEngine.CustomVehicles.isInVehicle = Game_Player.prototype.isInVehicle;
	Game_Player.prototype.isInVehicle = function () {
		return VictorEngine.CustomVehicles.isInVehicle.call(this) || this.isInCustomVehicle();
	};

	VictorEngine.CustomVehicles.isInAirship = Game_Player.prototype.isInAirship;
	Game_Player.prototype.isInAirship = function () {
		return VictorEngine.CustomVehicles.isInAirship.call(this) || this.isLeavingAboveVehicle();
	};

	VictorEngine.CustomVehicles.canStartLocalEvents = Game_Player.prototype.canStartLocalEvents;
	Game_Player.prototype.canStartLocalEvents = function () {
		return VictorEngine.CustomVehicles.canStartLocalEvents.call(this) && !this.isHighAltitude();
	};

	VictorEngine.CustomVehicles.isOnDamageFloor = Game_Player.prototype.isOnDamageFloor;
	Game_Player.prototype.isOnDamageFloor = function () {
		return VictorEngine.CustomVehicles.isOnDamageFloor.call(this) && !this.isHighAltitude();
	};

	VictorEngine.CustomVehicles.isCollidedWithCharacters = Game_Player.prototype.isCollidedWithCharacters;
	Game_Player.prototype.isCollidedWithCharacters = function (x, y) {
		if (this.isHighAltitude()) {
			return false;
		} else {
			return Game_Character.prototype.isCollidedWithCharacters.call(this, x, y);
		}
	};

	VictorEngine.CustomVehicles.getOnVehicle = Game_Player.prototype.getOnVehicle;
	Game_Player.prototype.getOnVehicle = function () {
		var result = VictorEngine.CustomVehicles.getOnVehicle.call(this);
		if (!result) result = this.getOnCustomVehicle();
		return result;
	};

	VictorEngine.CustomVehicles.getOffVehicle = Game_Player.prototype.getOffVehicle;
	Game_Player.prototype.getOffVehicle = function () {
		this._isLeavingAboveVehicle = this.isInCustomVehicle() && this.vehicle().above();
		var result = VictorEngine.CustomVehicles.getOffVehicle.call(this);
		this._isLeavingAboveVehicle = false;
		return result;
	};

	VictorEngine.CustomVehicles.meetsEncounterConditions = Game_Player.prototype.meetsEncounterConditions;
	Game_Player.prototype.meetsEncounterConditions = function (encounter) {
		var vehicle = this.vehicle();
		if (vehicle && vehicle.isCustom() && vehicle.encounterRegionOk()) {
			var region = vehicle.encounterRegion(this.regionId());
			return (region && encounter.regionSet.contains(region));
		} else {
			return VictorEngine.CustomVehicles.meetsEncounterConditions.call(this, encounter)
		}
	};

	VictorEngine.CustomVehicles.encounterProgressValue = Game_Player.prototype.encounterProgressValue;
	Game_Player.prototype.encounterProgressValue = function () {
		var result = VictorEngine.CustomVehicles.encounterProgressValue.call(this)
		if (this.isInCustomVehicle()) result *= this.vehicle().encounterRate();
		return result;
	};

	VictorEngine.CustomVehicles.updateVehicleGetOff = Game_Player.prototype.updateVehicleGetOff;
	Game_Player.prototype.updateVehicleGetOff = function () {
		if (!this.areFollowersGathering() && this.vehicle().isLowest()) this._isHighAltitude = false;
		VictorEngine.CustomVehicles.updateVehicleGetOff.call(this);
	};

	Game_Player.prototype.getOnCustomVehicle = function () {
		var direction = this.direction();
		var x1 = this.x;
		var y1 = this.y;
		var x2 = $gameMap.roundXWithDirection(x1, direction);
		var y2 = $gameMap.roundYWithDirection(y1, direction);
		var type = $gameMap.getOnCustomVehicle(x1, y1, x2, y2);
		if (type) {
			this._vehicleType = type;
			this._isHighAltitude = this.vehicle().isHighAltitude();
		}
		if (this.isInVehicle()) {
			this._vehicleGettingOn = true;
			if (!this.vehicle().above()) {
				this.forceMoveForward();
			}
			this.gatherFollowers();
		}
		return this._vehicleGettingOn;
	}

	Game_Player.prototype.isInCustomVehicle = function () {
		var basicVehicles = ['walk', 'boat', 'ship', 'airship'];
		return this._vehicleType && !basicVehicles.contains(this._vehicleType);
	};

	Game_Player.prototype.isHighAltitude = function () {
		return this._isHighAltitude;
	};

	Game_Player.prototype.isLeavingAboveVehicle = function () {
		return this._isLeavingAboveVehicle;
	};

	//=============================================================================
	// Game_Map
	//=============================================================================

	VictorEngine.CustomVehicles.createVehicles = Game_Map.prototype.createVehicles;
	Game_Map.prototype.createVehicles = function () {
		VictorEngine.CustomVehicles.createVehicles.call(this);
		Object.keys($dataSystem.customVehicles).forEach(function (type) {
			this._vehicles.push(new Game_CustomVehicle(type))
		}, this);
	};

	VictorEngine.CustomVehicles.vehicleGameMap = Game_Map.prototype.vehicle;
	Game_Map.prototype.vehicle = function (type) {
		var result = VictorEngine.CustomVehicles.vehicleGameMap.call(this, type);
		return !result ? this.customVehicle(type) : result;
	};

	Game_Map.prototype.vehiclesXy = function (x, y) {
		return this._vehicles.filter(function (vehicle) {
			return vehicle.pos(x, y) && vehicle !== $gamePlayer.vehicle();
		});
	};

	Game_Map.prototype.customVehicle = function (type) {
		this.count = this.count || 0;
		this.count++
		for (var i = 3; i < this._vehicles.length; i++) {
			var vehicle = this._vehicles[i];
			if (vehicle.type() === type.toLowerCase()) return vehicle;
		}
		return null;
	};

	Game_Map.prototype.getOnCustomVehicle = function (x1, y1, x2, y2) {
		for (var i = 3; i < this._vehicles.length; i++) {
			var vehicle = this._vehicles[i];
			if (vehicle.isBoardOk(x1, y1, x2, y2, $gamePlayer.direction())) return vehicle.type();
		}
		return null;
	};

	Game_Map.prototype.isCollidedWithCustomVehicles = function (x, y) {
		for (var i = 3; i < this._vehicles.length; i++) {
			var vehicle = this._vehicles[i];
			if (vehicle.posNt(x, y) && !vehicle.above()) return true;
		}
		return false;
	};

	Game_Map.prototype.currentVehicle = function () {
		return this.customVehicle(this._type);
	};

	//=============================================================================
	// Game_Vehicle
	//=============================================================================

	Game_Vehicle.prototype.isCustom = function () {
		return false;
	};

	Game_Vehicle.prototype.isDriving = function () {
		return this._driving;
	};

	//=============================================================================
	// Spriteset_Map
	//=============================================================================

	VictorEngine.CustomVehicles.shipBattleback1Name = Spriteset_Battle.prototype.shipBattleback1Name;
	Spriteset_Battle.prototype.shipBattleback1Name = function () {
		if ($gamePlayer.vehicle() && $gamePlayer.vehicle().isCustom()) {
			return this.normalBattleback1Name();
		} else {
			return VictorEngine.CustomVehicles.shipBattleback1Name.call(this)
		}
	};

	VictorEngine.CustomVehicles.shipBattleback1Name = Spriteset_Battle.prototype.shipBattleback1Name;
	Spriteset_Battle.prototype.shipBattleback2Name = function () {
		if ($gamePlayer.vehicle() && $gamePlayer.vehicle().isCustom()) {
			return this.normalBattleback2Name();
		} else {
			return VictorEngine.CustomVehicles.shipBattleback2Name.call(this)
		}
	};

	VictorEngine.CustomVehicles.battleback1Name = Spriteset_Battle.prototype.battleback1Name;
	Spriteset_Battle.prototype.battleback1Name = function () {
		var result = VictorEngine.CustomVehicles.battleback1Name.call(this);
		var vehicle = this.vehicleBattleback1()
		return vehicle ? vehicle : result;
	};

	VictorEngine.CustomVehicles.battleback2Name = Spriteset_Battle.prototype.battleback2Name;
	Spriteset_Battle.prototype.battleback2Name = function () {
		var result = VictorEngine.CustomVehicles.battleback2Name.call(this);
		var vehicle = this.vehicleBattleback2()
		return vehicle ? vehicle : result;
	};

	Spriteset_Battle.prototype.vehicleBattleback1 = function () {
		var vehicle = $gamePlayer.vehicle()
		if (vehicle && vehicle.isCustom() && vehicle.battleback1()) {
			return vehicle.battleback1()
		} else {
			return null;
		}
	};

	Spriteset_Battle.prototype.vehicleBattleback2 = function () {
		var vehicle = $gamePlayer.vehicle()
		if (vehicle && vehicle.isCustom() && vehicle.battleback2()) {
			return vehicle.battleback2()
		} else {
			return null;
		}
	};

	//=============================================================================
	// Spriteset_Map
	//=============================================================================

	VictorEngine.CustomVehicles.updateShadow = Spriteset_Map.prototype.updateShadow;
	Spriteset_Map.prototype.updateShadow = function () {
		VictorEngine.CustomVehicles.updateShadow.call(this);
		if ($gamePlayer.isHighAltitude()) {
			var vehicle = $gamePlayer.vehicle();
			this._shadowSprite.x = vehicle.shadowX();
			this._shadowSprite.y = vehicle.shadowY();
			this._shadowSprite.opacity = vehicle.shadowOpacity();
		}
	};

	//=============================================================================
	// Game_Interpreter
	//=============================================================================

	VictorEngine.CustomVehicles.pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		VictorEngine.CustomVehicles.pluginCommand.call(this, command, args);
		var v = $gameVariables._data;
		if (command.toLowerCase() === 'setvehiclelocation') {
			var m = Number(eval(args[1])) || 0;
			var x = Number(eval(args[2])) || 0;
			var y = Number(eval(args[3])) || 0;
			var vehicle = $gameMap.vehicle(args[0]);
			if (vehicle) vehicle.setLocation(m, x, y);
		}
		if (command.toLowerCase() === 'changevehicleimage') {
			var vehicle = $gameMap.vehicle(args[0]);
			if (vehicle) vehicle.setImage(args[1], Number(eval(args[2])) || 0);
		}
		if (command.toLowerCase() === 'changevehiclebgm') {
			var vehicle = $gameMap.vehicle(args[0]);
			var n = args[0];
			var l = Number(eval(args[1])) || 90;
			var t = Number(eval(args[2])) || 100;
			var p = Number(eval(args[3])) || 0;
			if (vehicle) vehicle.setBgm({ name: n, pan: p, pitch: t, volume: l });
		}
	};

})();

//=============================================================================
// Game_CustomVehicle
//=============================================================================

function Game_CustomVehicle() {
	this.initialize.apply(this, arguments);
}

Game_CustomVehicle.prototype = Object.create(Game_Vehicle.prototype);
Game_CustomVehicle.prototype.constructor = Game_CustomVehicle;

(function () {

	Game_CustomVehicle.prototype.initialize = function (type) {
		Game_Vehicle.prototype.initialize.call(this, type);
		this._idleSounsDelay = 0;
		this._moveSounsDelay = 0;
		this.setStepAnime(false);
	};

	Game_CustomVehicle.prototype.playBgm = function () {
		var bgm = this._bgm || this.vehicle().bgm;
		if (bgm.name !== '') AudioManager.playBgm(bgm);
	};

	Game_CustomVehicle.prototype.isCustom = function () {
		return true;
	};

	Game_CustomVehicle.prototype.type = function () {
		return this._type;
	};

	Game_CustomVehicle.prototype.initMoveSpeed = function () {
		this.setMoveSpeed(this.vehicle().speed || 1);
	};

	Game_CustomVehicle.prototype.vehicle = function () {
		return $dataSystem.customVehicles[this._type] || {};
	};

	Game_CustomVehicle.prototype.setStepAnime = function (stepAnime) {
		this._stepAnime = this.vehicle().idle || (stepAnime ? this.vehicle().step : false);
	};

	Game_CustomVehicle.prototype.syncWithPlayer = function () {
		if (this.vehicleStopped()) this.resetStopCount();
		Game_Vehicle.prototype.syncWithPlayer.call(this);
	};

	Game_CustomVehicle.prototype.isMoving = function () {
		if (this._driving) {
			return $gamePlayer.isMoving()
		} else {
			return Game_Vehicle.prototype.isMoving.call(this);
		}
	};

	Game_CustomVehicle.prototype.getOn = function () {
		Game_Vehicle.prototype.getOn.call(this);
		this.gameSwithOn();
	};

	Game_CustomVehicle.prototype.getOff = function () {
		this.gameSwithOff();
		Game_Vehicle.prototype.getOff.call(this);
	};

	Game_CustomVehicle.prototype.vehicleStopped = function () {
		return ($gamePlayer._x === this._x && $gamePlayer._realX === this._realX &&
			$gamePlayer._y === this._y && $gamePlayer._realY === this._realY &&
			$gamePlayer._direction === this._direction)
	};

	Game_CustomVehicle.prototype.maxAltitude = function () {
		return this.vehicle().altitude || 0;
	};

	Game_CustomVehicle.prototype.gameSwithOn = function () {
		var switchId = this.vehicle().gameSwitch;
		if (switchId) $gameSwitches.setValue(switchId, true);
	};

	Game_CustomVehicle.prototype.gameSwithOff = function () {
		var switchId = this.vehicle().gameSwitch;
		if (switchId) $gameSwitches.setValue(switchId, false);
	};

	Game_CustomVehicle.prototype.canMove = function () {
		return this.isHighAltitude() ? this.isHighest() : true;
	};

	Game_CustomVehicle.prototype.update = function () {
		Game_Character.prototype.update.call(this);
		if (this.isHighAltitude()) this.updateAirship();
	};

	Game_CustomVehicle.prototype.isHighAltitude = function () {
		return this.maxAltitude() > 1;
	};

	Game_CustomVehicle.prototype.above = function () {
		return this.vehicle().above;
	};

	Game_CustomVehicle.prototype.passableRegion = function (x, y) {
		return this.vehicle().passableRegion.contains($gameMap.regionId(x, y));
	};

	Game_CustomVehicle.prototype.landingRegion = function (x, y) {
		return this.vehicle().landingRegion.contains($gameMap.regionId(x, y));
	};

	Game_CustomVehicle.prototype.boardingRegion = function (x, y) {
		return this.vehicle().boardingRegion.contains($gameMap.regionId(x, y));
	};

	Game_CustomVehicle.prototype.passableTerrain = function (x, y) {
		return this.vehicle().passableTerrain.contains($gameMap.terrainTag(x, y));
	};

	Game_CustomVehicle.prototype.landingTerrain = function (x, y) {
		return this.vehicle().landingTerrain.contains($gameMap.terrainTag(x, y));
	};

	Game_CustomVehicle.prototype.boardingTerrain = function (x, y) {
		return this.vehicle().boardingTerrain.contains($gameMap.terrainTag(x, y));
	};

	Game_CustomVehicle.prototype.passableRegionOK = function (x, y) {
		return this.vehicle().passableRegion.length > 0 && this.passableRegion(x, y);
	};

	Game_CustomVehicle.prototype.passableTerrainOK = function (x, y) {
		return this.vehicle().passableTerrain.length > 0 && this.passableTerrain(x, y);
	};

	Game_CustomVehicle.prototype.isPassableOK = function (x, y) {
		return this.passableRegionOK(x, y) || this.passableTerrainOK(x, y);
	};

	Game_CustomVehicle.prototype.isLandingOK = function (x, y) {
		console.log(this.noLandingRestriction(), this.landingRegion(x, y), this.landingTerrain(x, y))
		return this.noLandingRestriction() || this.landingRegion(x, y) || this.landingTerrain(x, y);
	};

	Game_CustomVehicle.prototype.isBoardingOK = function (x, y) {
		return this.noBoardingRestriction() || this.boardingRegion(x, y) || this.boardingTerrain(x, y);
	};

	Game_CustomVehicle.prototype.noLandingRestriction = function () {
		var vehicle = this.vehicle()
		return vehicle.landingRegion.length === 0 && vehicle.landingTerrain.length === 0;
	};

	Game_CustomVehicle.prototype.noBoardingRestriction = function () {
		var vehicle = this.vehicle()
		return vehicle.boardingRegion.length === 0 && vehicle.boardingTerrain.length === 0;
	};


	Game_CustomVehicle.prototype.encounterRegion = function (regionId) {
		return this.vehicle().encounterRegion[regionId] || this.vehicle().encounterRegion[0];
	};

	Game_CustomVehicle.prototype.encounterRegionOk = function () {
		return Object.keys(this.vehicle().encounterRegion).length > 0
	};

	Game_CustomVehicle.prototype.encounterRate = function () {
		return this.vehicle().encounterRate / 100 || 0;
	};

	Game_CustomVehicle.prototype.passability = function (type) {
		return this.vehicle().passability === type.toLowerCase();
	};

	Game_CustomVehicle.prototype.idleSound = function () {
		return this.vehicle().idleSound;
	};

	Game_CustomVehicle.prototype.moveSound = function () {
		return this.vehicle().moveSound;
	};

	Game_CustomVehicle.prototype.battleback1 = function () {
		var battleback = this.vehicle().battleback;
		var result = battleback[$gamePlayer.regionId()] || battleback[0] || {};
		return result.battleback1;
	};

	Game_CustomVehicle.prototype.battleback2 = function () {
		var battleback = this.vehicle().battleback;
		var result = battleback[$gamePlayer.regionId()] || battleback[0] || {};
		return result.battleback2;
	};

	Game_CustomVehicle.prototype.isMapPassable = function (x, y, d) {
		var x2 = $gameMap.roundXWithDirection(x, d);
		var y2 = $gameMap.roundYWithDirection(y, d);
		if (!$gameMap.isValid(x2, y2)) return false;
		if (this.passability('airship')) return true;
		if (this.isPassableOK(x2, y2)) return true;
		if (this.passability('boat') && $gameMap.isBoatPassable(x2, y2)) return true;
		if (this.passability('ship') && $gameMap.isShipPassable(x2, y2)) return true;
		if (this.passability('player') && $gameMap.isPassable(x2, y2)) return true;
		return false;
	};

	Game_CustomVehicle.prototype.isLandOk = function (x, y, d) {
		if (this.above()) {
			if (!this.isLandingOK(x, y)) return false;
			if (!$gameMap.checkPassage(x, y, 0x0f)) return false;
			if ($gameMap.eventsXy(x, y).length > 0) return false;
			if ($gameMap.vehiclesXy(x, y).length > 0) return false;
		} else {
			var x2 = $gameMap.roundXWithDirection(x, d);
			var y2 = $gameMap.roundYWithDirection(y, d);
			if (!$gameMap.isValid(x2, y2)) return false;
			if (!this.isLandingOK(x2, y2)) return false;
			if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) return false;
			if (this.isCollidedWithCharacters(x2, y2)) return false;
		}
		return true;
	};

	Game_CustomVehicle.prototype.isBoardOk = function (x1, y1, x2, y2, d) {
		if (this.above()) {
			if (!this.pos(x1, y1)) return false;
			if (!this.isBoardingOK(x1, y1)) return false;
		} else {
			if (!this.pos(x2, y2)) return false;
			if (!$gameMap.isValid(x2, y2)) return false;
			if (!this.isBoardingOK(x1, y1)) return false;
		}
		return true;
	};

	Game_CustomVehicle.prototype.updateStop = function () {
		Game_CharacterBase.prototype.updateStop.call(this)
		this.idleSoundUpdate();
	};

	Game_CustomVehicle.prototype.updateMove = function () {
		Game_CharacterBase.prototype.updateMove.call(this)
		this.moveSoundUpdate();
	};

	Game_CustomVehicle.prototype.idleSoundUpdate = function () {
		this._idleSounsDelay++;
		if (this._driving && this._idleSounsDelay > this.idleSound().delay) {
			if (this.idleSound().name !== '') AudioManager.playSe(this.idleSound());
			this._idleSounsDelay = 0;
			this._moveSounsDelay = 0;
		}
	};

	Game_CustomVehicle.prototype.moveSoundUpdate = function () {
		this._moveSounsDelay++;
		if (this._driving && this._moveSounsDelay > this.moveSound().delay) {
			if (this.idleSound().name !== '') AudioManager.playSe(this.moveSound());
			this._moveSounsDelay = 0;
			this._idleSounsDelay = 0;
		}
	};

})();