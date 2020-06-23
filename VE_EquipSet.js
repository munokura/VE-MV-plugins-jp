/*
 * ===========================================================================
 * ** Victor Engine MV - Equip Set
 * ---------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2016.04.14 > First release.
 * ===========================================================================
 */

var Imported = Imported || {};
Imported['VE - Equip Set'] = '1.00';

var VictorEngine = VictorEngine || {};
VictorEngine.EquipSet = VictorEngine.EquipSet || {};

(function() {


VictorEngine.EquipSet.loadDatabase = DataManager.loadDatabase;

DataManager.loadDatabase = function() {


VictorEngine.EquipSet.loadDatabase.call(this);


PluginManager.requiredPlugin.call(PluginManager, 'VE - Equip Set', 'VE - Basic Module', '1.12');

};


VictorEngine.EquipSet.requiredPlugin = PluginManager.requiredPlugin;

PluginManager.requiredPlugin = function(name, required, version) {


if (!VictorEngine.BasicModule) {



var msg = 'The plugin ' + name + ' requires the plugin ' + required;



msg += ' v' + version + ' or higher installed to work properly.';



msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';



throw new Error(msg);


} else {



VictorEngine.EquipSet.requiredPlugin.call(this, name, required, version)


};

};

})();

/*:
 * @plugindesc v1.00 - Using sets of equipment grant extra benefits.
 * @author Victor Sant
 *
 * @help
 * ---------------------------------------------------------------------------
 * Actors and Classes Notetags:
 * ---------------------------------------------------------------------------
 *
 * <equip set>
 *  set: item X, item Y
 *  X parts: Y
 * </equip set>
 *  Thist tag setups the equipment set.
 *  The setup have two basic parts: the set items and the states that
 *
 * ---------------
 *
 *  - Set
 *  List of equips, states and equip types that grants extra benefits when used
 *  together. You can setup weapons, armors, armor types and weapon types.
 *    armor x  : armor Id X.
 *    weapon x : weapon Id X.
 *    atype x  : armors with type Id X.
 *    wtype x  : weapons with type Id X.
 *
 *  You can use a shorter form for the setup instead of using the complete text.
¨*  Use the following shorter form to replace the long forms:
 *    a  : armor
 *    w  : weapon
 *    at : atype
 *    wt : wtype
 *     EX.: weapon 5 can be replaced with w5
 *          atype 3 can be replaced with at3
 *
 *  Don't add repeated values, since the plugin will just match the same equip
 *  more than once.
 *
 * ---------------
 *
 *  - Parts
 *  Number of parts that needs to be equiped to have extra benefits of the set.
 *  The benefit is represented by a passive state. You can setup the set to give
 *  different states based on the number of equiped parts of it.
 *    Ex.: 2 Parts: 10
 *         4 Parts: 12
 *
 * ---------------------------------------------------------------------------
 * Additional Information:
 * ---------------------------------------------------------------------------
 *
 *  - Equip Set
 *  The equip set notetag must be  added to the actor and/or class. Actors
 *  without the tag will not receive the bonus state for assembling the parts of
 *  the set.
 *  You can use the plugin 'VE - Notes Text File' to make the notetag setup
 *  easier.
 *
 * ---------------------------------------------------------------------------
 * Example Notetags:
 * ---------------------------------------------------------------------------
 *
 * <equip set>
 *  set: weapon 1, armor 1, armor 2, armor 3
 *  4 parts: 5
 * </equip set>
 *  Adds the state 5 when the weapon 1 and the armors 1, 2 and 3 are equiped.
 *
 * ---------------
 *
 * <equip set>
 *  set: w1, a1, a2, a3
 *  4 parts: 5
 * </equip set>
 *  Adds the state 5 when the weapon 1 and the armors 1, 2 and 3 are equiped.
 *  (using short form)
 *
 * ---------------
 *
 * <equip set>
 *  set: wt2, at3
 *  2 parts: 12
 * </equip set>
 *  Adds the state 12 when equipig an weapon with type Id 2 and an armor with
 *  type Id 3.
 *
 * ---------------
 *
 * <equip set>
 *  set: a10, a15, a20, a25
 *  2 parts: 10
 *  4 parts: 11
 * </equip set>
 *  Adds the state 10 when equiping 2 items among the armors 10, 15, 20 and 25.
 *  Adds the state 11 when equiping the armors 10, 15, 20 and 25.
 *  (all states with meeting criteria are added)
 *
 * ---------------------------------------------------------------------------
 */
/*:ja
 * @plugindesc v1.00 装備セットを揃えると、追加ボーナスが得られるシステムを追加できます。
 * @author Victor Sant
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/equip-set/
 * ===========================================================================
 * 必要プラグイン
 * ===========================================================================
 *
 * このプラグインを使用するには、下記のプラグインが必要です。
 * - VE_BasicModule
 *
 * ---------------------------------------------------------------------------
 * アクター、職業のメモタグ
 * ---------------------------------------------------------------------------
 *
 * <equip set>
 *  set: item X, item Y
 *  X parts: Y
 * </equip set>
 * このタグは、装備セットを設定します。
 * 設定の2つの基本的な構成:設定項目、ステート
 *
 * ---------------
 *
 *  - Set
 *  一緒に使用すると追加ボーナスが得られる装備、ステート、装備タイプの一覧。
 *  武器、防具、武器タイプ、防具タイプを設定できます。
 *
 *    weapon x : 武器ID X
 *    armor x  : 防具ID X
 *    wtype x  : 武器タイプID X
 *    atype x  : 防具タイプID X
 *
 *  完全なテキストを使用する代わりに、短い書式を設定に使用できます。
 *   次の短い書式を使用して、長い書式を置き換えます。
 *    a  : armor
 *    w  : weapon
 *    at : atype
 *    wt : wtype
 *     例 : weapon 5 は w5 と省略して書けます。
 *          atype 3 は at3 と省略して書けます。
 *
 *  同じ装備には1回1つのみの効果しか反映しません。
 *  繰り返し値を追加しないでください。
 *
 * ---------------
 *
 *  - Parts
 *  セットの追加ボーナスを得るために装備する必要がある装備数。
 *  ボーナスはパッシブなステートで表されます。
 *  装備されている装備数に基づいて異なるステートを提供するように
 *  セットを設定できます。
 *    例 : 2 Parts: 10
 *         4 Parts: 12
 *
 * ---------------------------------------------------------------------------
 * 追加情報
 * ---------------------------------------------------------------------------
 *
 *  - Equip Set
 *  装備セットメモタグは、アクター/職業、
 *  あるいはその両方に追加する必要があります。
 *  タグのないアクターは、
 *  セットの一部を組み立ててもボーナスステートを受けません。
 *  プラグイン'VE - Notes Text File'を使用して、
 *  メモタグの設定を簡単にすることができます。
 *
 * ---------------------------------------------------------------------------
 * 追記(ムノクラ)
 * ---------------------------------------------------------------------------
 *
 * ボーナスステートは、装備を揃えた状態で戦闘に入った時に発動します。
 * 装備した瞬間には、発動しません。
 *
 * ---------------------------------------------------------------------------
 * メモタグの例：
 * ---------------------------------------------------------------------------
 *
 * <equip set>
 *  set: weapon 1, armor 1, armor 2, armor 3
 *  4 parts: 5
 * </equip set>
 *  武器1と防具1、2、3が装備されている時、ステート5を追加します。
 *
 * ---------------
 *
 * <equip set>
 *  set: w1, a1, a2, a3
 *  4 parts: 5
 * </equip set>
 *  武器1と防具1、2、3が装備されている時、ステート5を追加します。
 *  (短い書式を使用)
 * ---------------
 *
 * <equip set>
 *  set: wt2, at3
 *  2 parts: 12
 * </equip set>
 *  タイプID2の武器とタイプID3の防具を装備した時、ステート12を追加します。
 *
 * ---------------
 *
 * <equip set>
 *  set: a10, a15, a20, a25
 *  2 parts: 10
 *  4 parts: 11
 * </equip set>
 * 防具10、15、20、25のうち2つを装備するとステート10が追加されます。
 * 防具10、15、20、25の4つを装備するとステート11が追加されます。
 * (基準を満たす全てのステートが追加されます)
 *
 * ---------------------------------------------------------------------------
 */

(function() {


//============================================================================

// Parameters

//============================================================================


if (Imported['VE - Basic Module']) {


var parameters = VictorEngine.getPluginParameters();


VictorEngine.Parameters = VictorEngine.Parameters || {};


VictorEngine.Parameters.EquipSet = {};


VictorEngine.Parameters.EquipSet.PluginParameter = Number(parameters["Plugin Parameter"]) || 0;


VictorEngine.Parameters.EquipSet.PluginParameter = String(parameters["Plugin Parameter"]).trim();


VictorEngine.Parameters.EquipSet.PluginParameter = eval(parameters["Plugin Parameter"]);

}


//============================================================================

// VictorEngine

//============================================================================


VictorEngine.EquipSet.loadNotetagsValues = VictorEngine.loadNotetagsValues;

VictorEngine.loadNotetagsValues = function(data, index) {


VictorEngine.EquipSet.loadNotetagsValues.call(this, data, index);


var list = ['actor', 'class'];


if (this.objectSelection(index, list)) VictorEngine.EquipSet.loadNotes(data);

};


VictorEngine.EquipSet.loadNotes = function(data) {


data.equipSet = data.equipSet || [];


this.processNotes(data);

};


VictorEngine.EquipSet.processNotes = function(data) {


var match;


var regex = VictorEngine.getNotesValues('equip set')


while ((match = regex.exec(data.note)) !== null) { this.processValues(data, match) };

};


VictorEngine.EquipSet.processValues = function(data, match) {


var result  = {};


this.processSet(result, match[1]);


this.processParts(result, match[1]);


data.equipSet.push(result);

};


VictorEngine.EquipSet.processSet = function(data, match) {


data.set = [];


var value;


var regex = new RegExp('set[ ]*:[ ]*((?:\\w+[ ]*\\d+[ ]*,?[ ]*)+)', 'gi');


while ((value = regex.exec(match)) !== null) { this.processEquip(data, value) }

};


VictorEngine.EquipSet.processParts = function(data, match) {


data.parts = [];


var value;


var regex = new RegExp('(\\d+)[ ]*parts[ ]*:[ ]*(\\d+)', 'gi');


while ((value = regex.exec(match)) !== null) {



var result = {};



result.number = Number(value[1]);



result.state  = Number(value[2]);



data.parts.push(result)


}

};


VictorEngine.EquipSet.processEquip = function(data, match) {


var value;


var regex = new RegExp('(armor|weapon|atype|wtype|a|w|at|wt)[ ]*(\\d+)', 'gi');


while ((value = regex.exec(match[1])) !== null) {



var result  = {};



result.type = this.processType(value[1]);



result.id   = Number(value[2]);



data.set.push(result)


}

};


VictorEngine.EquipSet.processType = function(value) {


switch (value.toLowerCase()) {


case 'armor':



return 'a';


case 'weapon':



return 'w'


case 'atype':



return 'at';


case 'wtype':



return 'wt'


default:



return value.toLowerCase();


}

};


//============================================================================

// Game_Actor

//============================================================================

  
VictorEngine.EquipSet.initMembers = Game_Actor.prototype.initMembers;

Game_Actor.prototype.initMembers = function() {


this._equipSetStates = [];


VictorEngine.EquipSet.initMembers.call(this);

};

  
VictorEngine.EquipSet.refresh = Game_Actor.prototype.refresh;

Game_Actor.prototype.refresh = function() {


this.refreshequipSets();


VictorEngine.EquipSet.refresh.call(this);

};


Game_Actor.prototype.refreshequipSets = function() {


this.removeEquipSetStates();


this.setupEquipSetStates();

};


Game_Actor.prototype.removeEquipSetStates = function() {


this._equipSetStates.forEach(function(stateId) {



this.eraseState(stateId)


}, this);


this._equipSetStates = [];

};


Game_Actor.prototype.setupEquipSetStates = function() {


var sets = [].concat(this.actor().equipSet, this.currentClass().equipSet);


sets.forEach(function(equipSet) {



this.addEquipSetStates(equipSet);


}, this);

};


Game_Actor.prototype.addEquipSetStates = function(equipSet) {


var parts = 0;


equipSet.set.forEach(function(set) {



if (this.hasSetPart(set)) parts++;


}, this);


equipSet.parts.forEach(function(part) {



if (parts >= part.number) this.addEquipSetNewState(part.state);


}, this);

};


Game_Actor.prototype.hasSetPart = function(set) {


if (set.type === 'a' && this.equips().contains($dataArmors[set.id]))  return true;


if (set.type === 'w' && this.equips().contains($dataWeapons[set.id])) return true;


return this.equips().some(function(item) {



if (item && set.type === 'at' && DataManager.isArmor(item)  && item.atypeId === set.id) return true;



if (item && set.type === 'wt' && DataManager.isWeapon(item) && item.wtypeId === set.id) return true;



return false;


}, this);

};


Game_Actor.prototype.addEquipSetNewState = function(stateId) {


if (this.isAlive()) {



if (!this.isStateAffected(stateId)) {




if (!this._equipSetStates.contains(stateId)) this._equipSetStates.push(stateId);




if (stateId === this.deathStateId()) this.die();




var restricted = this.isRestricted();




this._states.push(stateId);




this.sortStates();



};


}

};

})();