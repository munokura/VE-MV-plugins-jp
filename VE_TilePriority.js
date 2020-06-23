/*
 * ==============================================================================
 * ** Victor Engine MV - Tile Priority
 * ------------------------------------------------------------------------------
 *  VE_TilePriority.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Tile Priority'] = '1.01';

var VictorEngine = VictorEngine || {};
VictorEngine.TilePriority = VictorEngine.TilePriority || {};

(function () {

    VictorEngine.TilePriority.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        VictorEngine.TilePriority.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Tile Priority', 'VE - Basic Module', '1.21');
    };

    VictorEngine.TilePriority.requiredPlugin = PluginManager.requiredPlugin;
    PluginManager.requiredPlugin = function (name, required, version) {
        if (!VictorEngine.BasicModule) {
            var msg = 'The plugin ' + name + ' requires the plugin ' + required;
            msg += ' v' + version + ' or higher installed to work properly.';
            msg += ' Go to http:// victorenginescripts.wordpress.com/ to download the plugin.';
            throw new Error(msg);
        } else {
            VictorEngine.TilePriority.requiredPlugin.call(this, name, required, version)
        };
    };

})();

/*:
 * @plugindesc v1.01 - Setup tiles to have same priority as characters.
 * @author Victor Sant
 * 
 * @param Max Terrain Height
 * @desc The max value for terrain tags to be used as
 * priority heights
 * @default 3
 *
 * @help 
 * ==============================================================================
 *  To setup a tile to have the same priority as the player/events, you must
 *  follow two steps:
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  1 - Mark the tile as a 'Counter'
 *    On the Tileset tab of the database, there is a 'Counter' button, click on
 *    it and then mark the tile you want with a ♦.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  2 - Setup a height for the tile using the 'Terrain Tag' button.
 *    The value of the Terrain Tag is the 'height' of the tile, in coparison
 *    to the characters.
 * ==============================================================================
 *
 * ==============================================================================
 *  Additional Information:
 * ------------------------------------------------------------------------------
 *  
 *  - Max Terrain Height
 *  The terrain height is how many tiles high the tile is in comparison to the
 *  characters. It is set with Terrain Tags. All terrain tags to 1 up to the
 *  the value of the Plugin Parameter 'Max Terrain Height' are used for that.
 *  Terrain Tags higher with value higher than the Plugin Parameter will have
 *  no effect on the tileset priority.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  The passability is not affected by any means by this plugin, it has effect
 *  only on the display for the tile. 
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *  The priority setup don't work for Autotiles. Only normal Tiles can have the
 *  their priority changed.
 *
 * ==============================================================================
 *
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2016.06.11 > First release.
 *  v 1.01 - 2016.08.29 > Compatibility with RPG Maker v 1.3.0.
 */
/*:ja
 * @plugindesc v1.01 タイルにプライオリティを設定できます
 * @author Victor Sant
 *
 * @param Max Terrain Height
 * @text 最大地形高さ
 * @type number
 * @desc 優先高さとして使用する地形タグの最大値
 * @default 3
 *
 * @help 
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/tile-priority/
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
 * プレイヤー/イベントと同じプライオリティを持つタイルを設定するには、
 * 2つのステップを踏む必要があります。
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  1 - 'カウンター'としてタイルをマークします。
 *      データベースの「タイルセット」タブに「カウンター」ボタンがあります。
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *  2 - '地形タグ'ボタンを使用してタイルの高さを設定します。
 *      地形タグの値は、キャラクターと比較してタイルの「高さ」になります。
 * ===========================================================================
 *
 * ===========================================================================
 *  追加情報
 * ---------------------------------------------------------------------------
 *  
 *  - Max Terrain Height
 * 地形の高さとは、
 * キャラクターと比較して何枚のタイルの高さがあるかを表しています。
 * 地形タグで設定します。
 * プラグインパラメータ'Max Terrain Height'の値までの
 * 全ての地形タグが使用されます。
 * プラグインパラメータの値よりも高い値の地形タグは
 * タイルセットの優先度に影響しません。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * このプラグインによって通過性に影響はありませんが、効果があります。
 * タイルの表示にのみ効果があります。
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * オートタイルでは優先順位の設定ができません。
 * 優先順位を変更できるのは、通常のタイルのみです。
 *
 * ===========================================================================
 *
 * ===========================================================================
 *  Version History:
 * ---------------------------------------------------------------------------
 *  v 1.00 - 2016.06.11 > First release.
 *  v 1.01 - 2016.08.29 > Compatibility with RPG Maker v 1.3.0.
 */

(function () {

    //=============================================================================
    // Parameters
    //=============================================================================

    if (Imported['VE - Basic Module']) {
        var parameters = VictorEngine.getPluginParameters();
        VictorEngine.Parameters = VictorEngine.Parameters || {};
        VictorEngine.Parameters.TilePriority = {};
        VictorEngine.Parameters.TilePriority.MaxHeight = Number(parameters["Max Terrain Height"]) || 1;
    };

    //=============================================================================
    // Tilemap
    //=============================================================================

    /* Overwritten function */
    Tilemap.prototype._compareChildOrder = function (a, b) {
        if ((a.z || 0) !== (b.z || 0)) {
            return (a.z || 0) - (b.z || 0);
        } else if ((a.y || 0) !== (b.y || 0)) {
            return (a.y || 0) + (a.h || 0) - (b.y || 0) - (b.h || 0);
        } else if ((a.h || 0) !== (b.h || 0)) {
            return (a.h || 0) - (b.h || 0);
        } else {
            return a.spriteId - b.spriteId;
        }
    };

    VictorEngine.TilePriority.initialize = Tilemap.prototype.initialize;
    Tilemap.prototype.initialize = function () {
        this._priorirtyTiles = [];
        this._priorityTerrainId = VictorEngine.Parameters.TilePriority.MaxHeight.clamp(1, 7);
        VictorEngine.TilePriority.initialize.call(this);
    };

    VictorEngine.TilePriority.paintAllTiles = Tilemap.prototype._paintAllTiles;
    Tilemap.prototype._paintAllTiles = function (startX, startY) {
        this._clearPriorityTiles(startX, startY);
        VictorEngine.TilePriority.paintAllTiles.call(this, startX, startY);
        this._requestPriorityTilesRefresh = false;
    };

    VictorEngine.TilePriority.updateLayerPositions = Tilemap.prototype._updateLayerPositions;
    Tilemap.prototype._updateLayerPositions = function (startX, startY) {
        var ox = Math.floor(this.origin.x);
        var oy = Math.floor(this.origin.y);
        VictorEngine.TilePriority.updateLayerPositions.call(this, startX, startY);
        for (var i = 0; i < this._priorirtyTiles.length; i++) {
            var sprite = this._priorirtyTiles[i];
            sprite.x = sprite.tx - ox;
            sprite.y = sprite.ty - oy;
        }
    };

    VictorEngine.TilePriority.paintTiles = Tilemap.prototype._paintTiles;
    Tilemap.prototype._paintTiles = function (startX, startY, x, y) {
        VictorEngine.TilePriority.paintTiles.call(this, startX, startY, x, y)
        if (this._requestPriorityTilesRefresh) {
            this._refreshPriorityTiles(startX, startY, x, y);
        }
    };

    VictorEngine.TilePriority.drawTile = Tilemap.prototype._drawTile;
    Tilemap.prototype._drawTile = function (bitmap, tileId, dx, dy) {
        if (!this._priorityTile(tileId)) {
            VictorEngine.TilePriority.drawTile.call(this, bitmap, tileId, dx, dy);
        }
    };

    Tilemap.prototype._priorityTile = function (tileId) {
        var flags = $gameMap.tilesetFlags();
        return !Tilemap.isAutotile(tileId) && (flags[tileId] & 0x80) !== 0 && this._terrainTag(tileId);
    }

    Tilemap.prototype._terrainTag = function (tileId) {
        var flags = $gameMap.tilesetFlags();
        var tag = flags[tileId] >> 12;
        return tag.clamp(0, this._priorityTerrainId);
    }

    Tilemap.prototype._refreshPriorityTiles = function (startX, startY, x, y) {
        var mx = startX + x;
        var my = startY + y;
        var width = $gameMap.width();
        var height = $gameMap.height();
        var dx = (mx * this._tileWidth).mod(this._layerWidth - this._tileWidth);
        var dy = (my * this._tileHeight).mod(this._layerHeight - this._tileHeight);
        var allTiles = [];
        allTiles.push(this._readMapData(mx, my, 0));
        allTiles.push(this._readMapData(mx, my, 1));
        allTiles.push(this._readMapData(mx, my, 2));
        allTiles.push(this._readMapData(mx, my, 3));
        for (var i = 0; i < allTiles.length; i++) {
            var tileId = allTiles[i];
            if (this._priorityTile(tileId) && !this.includeTileSprite(tileId, mx, my)) {
                this._drawPriorityTiles(tileId, mx, my, x, y);
                if ($gameMap.isLoopHorizontal() && dx < Graphics.width) {
                    this._drawPriorityTiles(tileId, mx + width, my, x, y);
                }
                if ($gameMap.isLoopVertical() && dy < Graphics.height) {
                    this._drawPriorityTiles(tileId, mx, my + height, x, y);
                }
                if ($gameMap.isLoopVertical() && $gameMap.isLoopHorizontal() &&
                    dx < Graphics.width && dy < Graphics.height) {
                    this._drawPriorityTiles(tileId, mx + width, my + height, x, y);
                }
            }
        }
    }

    Tilemap.prototype.includeTileSprite = function (tileId, mx, my) {
        for (var i = 0; i < this._priorirtyTiles.length; i++) {
            var sprite = this._priorirtyTiles[i];
            if (sprite.tileId === tileId && sprite.mx === mx && sprite.my === my) {
                return true;
            }
        }
        return false;
    }

    Tilemap.prototype._drawPriorityTiles = function (tileId, mx, my) {
        var bitmap = new Bitmap(this._tileWidth, this._tileHeight);
        var sprite = new Sprite(bitmap);
        var ox = Math.floor(this.origin.x);
        var oy = Math.floor(this.origin.y);
        var width = this._tileWidth;
        var height = this._tileHeight;
        sprite.tileId = tileId;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.mx = mx
        sprite.my = my
        sprite.tx = mx * width + width / 2;
        sprite.ty = my * height + height;
        sprite.x = sprite.tx - ox;
        sprite.y = sprite.ty - oy;
        sprite.z = 3;
        sprite.h = this._tileHeight * (this._terrainTag(tileId) - 1) || 1;
        sprite.setFrame(0, 0, this._tileWidth, this._tileHeight);
        this._drawTilemapTile(bitmap, tileId, 0, 0);
        this._priorirtyTiles.push(sprite);
        this.addChild(sprite);
    }

    Tilemap.prototype._clearPriorityTiles = function (startX, startY) {
        if (this._priorityTileset !== $gameMap.tileset() || this._priorityWidth !== this._tileWidth ||
            this._priorityHeight !== this._tileHeight || this._priorityStartX !== startX ||
            this._priorityStartY !== startY) {
            this._priorityTileset = $gameMap.tileset();
            this._priorityWidth = this._tileWidth;
            this._priorityHeight = this._tileHeight;
            this._priorityStartX = startX;
            this._priorityStartY = startY;
            var endX = startX + Math.ceil(this._width / this._tileWidth) + 1;
            var endY = startY + Math.ceil(this._height / this._tileHeight) + 1;
            for (var i = 0; i < this._priorirtyTiles.length; i++) {
                var sprite = this._priorirtyTiles[i];
                if (sprite.mx < startX || sprite.mx > endX || sprite.my < startY || sprite.my > endY) {
                    this._priorirtyTiles.splice(i, 1);
                    this.removeChild(sprite);
                    i--;
                }
            }
            this._requestPriorityTilesRefresh = true;
        }
    }

    Tilemap.prototype._drawTilemapTile = function (bitmap, tileId, dx, dy) {
        if (Tilemap.isVisibleTile(tileId)) {
            if (Tilemap.isAutotile(tileId)) {
                Tilemap.prototype._drawAutotile.call(this, bitmap, tileId, dx, dy);
            } else {
                Tilemap.prototype._drawNormalTile.call(this, bitmap, tileId, dx, dy);
            }
        }
    };

    Tilemap.priorityTerrainId = function () {
        return this._priorityTerrainId;
    }

    //=============================================================================
    // ShaderTilemap
    //=============================================================================

    VictorEngine.TilePriority.paintAllTilesShaderTilemap = ShaderTilemap.prototype._paintAllTiles;
    ShaderTilemap.prototype._paintAllTiles = function (startX, startY) {
        this._clearPriorityTiles(startX, startY);
        VictorEngine.TilePriority.paintAllTilesShaderTilemap.call(this, startX, startY);
        this._requestPriorityTilesRefresh = false;
    };

    VictorEngine.TilePriority.updateLayerPositionsShaderTilemap = ShaderTilemap.prototype._updateLayerPositions;
    ShaderTilemap.prototype._updateLayerPositions = function (startX, startY) {
        var ox = Math.floor(this.origin.x);
        var oy = Math.floor(this.origin.y);
        VictorEngine.TilePriority.updateLayerPositionsShaderTilemap.call(this, startX, startY);
        for (var i = 0; i < this._priorirtyTiles.length; i++) {
            var sprite = this._priorirtyTiles[i];
            sprite.x = sprite.tx - ox;
            sprite.y = sprite.ty - oy;
        }
    };

    VictorEngine.TilePriority.paintTilesShaderTilemap = ShaderTilemap.prototype._paintTiles;
    ShaderTilemap.prototype._paintTiles = function (startX, startY, x, y) {
        VictorEngine.TilePriority.paintTilesShaderTilemap.call(this, startX, startY, x, y);
        if (this._requestPriorityTilesRefresh) {
            this._refreshPriorityTiles(startX, startY, x, y);
        }
    };

    VictorEngine.TilePriority.drawTileShaderTilemap = ShaderTilemap.prototype._drawTile;
    ShaderTilemap.prototype._drawTile = function (layer, tileId, dx, dy) {
        if (!this._priorityTile(tileId)) {
            VictorEngine.TilePriority.drawTileShaderTilemap.call(this, layer, tileId, dx, dy);
        }
    };

    //=============================================================================
    // Game_Map
    //=============================================================================

    VictorEngine.TilePriority.isCounter = Game_Map.prototype.isCounter;
    Game_Map.prototype.isCounter = function (x, y) {
        return VictorEngine.TilePriority.isCounter.call(this, x, y) && !this.isPriorityTile(x, y);
    };

    Game_Map.prototype.isPriorityTile = function (x, y) {
        var flags = this.tilesetFlags();

        var height = Tilemap.priorityTerrainId();

        return this.layeredTiles(x, y).some(function (tileId) {
            return (flags[tileId] & 0x80) !== 0 && (flags[tileId] >> 12) > 0 && (flags[tileId] >> 12) > height;
        });
    };

})();
