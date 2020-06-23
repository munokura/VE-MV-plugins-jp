/*
 * ==============================================================================
 * ** Victor Engine MV - Notes Text File
 * ------------------------------------------------------------------------------
 * Version History:
 *  v 1.00 - 2015.12.18 > First release.
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Notes Text File'] = '1.00';

var VictorEngine = VictorEngine || {};
VictorEngine.NotesTextFile = VictorEngine.NotesTextFile || {};

(function () {

	VictorEngine.NotesTextFile.loadDatabase = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.NotesTextFile.loadDatabase.call(this);
		PluginManager.requiredPlugin.call(PluginManager, 'VE - Notes Text File', 'VE - Basic Module', '1.07');
	};

	VictorEngine.NotesTextFile.requiredPlugin = PluginManager.requiredPlugin;
	PluginManager.requiredPlugin = function (name, required, version) {
		if (!VictorEngine.BasicModule) {
			var msg = 'The plugin ' + name + ' requires the plugin ' + required;
			msg += ' v' + version + ' or higher installed to work properly.';
			msg += ' Go to http://victorenginescripts.wordpress.com/ to download the plugin.';
			throw new Error(msg);
		} else {
			VictorEngine.NotesTextFile.requiredPlugin.call(this, name, required, version)
		};
	};

})();

/*:
 * @plugindesc v1.00 - Use text files to write notetags.
 * @author Victor Sant
 *
 * @help 
 * Notetags for all objects:
 *  
 * <text note: 'filename'>
 *   Use the text contained on the file as a notetag. The filename must always be
 *   inside quotations. The file must be on the folder 'data/notes/'. You must
 *   create this new folder
 *
 */
/*:ja
 * @plugindesc v1.00 メモタグをテキストファイルで管理できます
 * @author Victor Sant
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * 元プラグイン:
 * https://victorenginescripts.wordpress.com/rpg-maker-mv/notes-text-file/
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
 * 説明
 * ===========================================================================
 *
 * 全てのオブジェクトのメモタグ
 *
 * <text note: 'filename'>
 *
 * ファイル内のテキストをメモタグとして使用します。
 * メモタグのコモンイベント化と考えると理解しやすいでしょう。
 *
 * ファイル名は引用符で囲まれていなければなりません。
 * ファイルは'data/notes/'フォルダになければなりません。
 * この新しいフォルダを作成する必要があります。
 */

(function () {

	//=============================================================================
	// DataManager
	//=============================================================================

	VictorEngine.NotesTextFile.loadDatabaseFile = DataManager.loadDatabase;
	DataManager.loadDatabase = function () {
		VictorEngine.NotesTextFile.files = 0
		VictorEngine.NotesTextFile.loadDatabaseFile.call(this);
	};

	VictorEngine.NotesTextFile.isDatabaseLoaded = DataManager.isDatabaseLoaded;
	DataManager.isDatabaseLoaded = function () {
		if (!VictorEngine.NotesTextFile.isLoaded()) return false;
		return VictorEngine.NotesTextFile.isDatabaseLoaded.call(this)
	};

	VictorEngine.NotesTextFile.isMapLoaded = DataManager.isMapLoaded;
	DataManager.isMapLoaded = function () {
		if (!VictorEngine.NotesTextFile.isLoaded()) return false;
		return VictorEngine.NotesTextFile.isMapLoaded.call(this)
	};

	VictorEngine.NotesTextFile.extractMetadata = DataManager.extractMetadata;
	DataManager.extractMetadata = function (data) {
		VictorEngine.NotesTextFile.extractMetadata.call(this, data)
		var regex = new RegExp("<text note:[ ]*('[^\']+'|\"[^\"]+\")>", "gi");
		while ((match = regex.exec(data.note)) !== null) {
			var name = match[1].slice(1, -1);
			VictorEngine.NotesTextFile.loadTextData(match[0], name, data);
		};
	};

	//=============================================================================
	// VictorEngine
	//=============================================================================

	VictorEngine.NotesTextFile.loadTextData = function (note, name, data) {
		this.files++;
		var url = 'data/notes/' + name + '.txt'
		var text = new XMLHttpRequest();
		text.open('GET', url);
		text.onload = function () { VictorEngine.NotesTextFile.onLoad(note, text, data); };
		text.onerror = function () { throw new Error('Failed to load: ' + url); };
		text.send();
	};

	VictorEngine.NotesTextFile.onLoad = function (note, text, data) {
		data.note = data.note.replace(note, text.responseText);
		this.files--;
	};

	VictorEngine.NotesTextFile.isLoaded = function () {
		return this.files === 0;
	};

})();