var hero_list = [
	"Abaddon",
	"Alchemist",
	"Ancient Apparition",
	"Anti-Mage",
	"Arc Warden",
	"Axe",
	"Bane",
	"Batrider",
	"Beastmaster",
	"Bloodseeker",
	"Bounty Hunter",
	"Brewmaster",
	"Bristleback",
	"Broodmother",
	"Centaur Warrunner",
	"Chaos Knight",
	"Chen",
	"Clinkz",
	"Clockwerk",
	"Crystal Maiden",
	"Dark Seer",
	"Dazzle",
	"Death Prophet",
	"Disruptor",
	"Doom",
	"Dragon Knight",
	"Drow Ranger",
	"Earth Spirit",
	"Earthshaker",
	"Elder Titan",
	"Ember Spirit",
	"Enchantress",
	"Enigma",
	"Faceless Void",
	"Gyrocopter",
	"Huskar",
	"Invoker",
	"Io",
	"Jakiro",
	"Juggernaut",
	"Keeper of the Light",
	"Kunkka",
	"Legion Commander",
	"Leshrac",
	"Lich",
	"Lifestealer",
	"Lina",
	"Lion",
	"Lone Druid",
	"Luna",
	"Lycan",
	"Magnus",
	"Medusa",
	"Meepo",
	"Mirana",
	"Morphling",
	"Naga Siren",
	"Natures Prophet",
	"Necrophos",
	"Night Stalker",
	"Nyx Assassin",
	"Ogre Magi",
	"Omniknight",
	"Oracle",
	"Outworld Devourer",
	"Phantom Assassin",
	"Phantom Lancer",
	"Phoenix",
	"Puck",
	"Pudge",
	"Pugna",
	"Queen of Pain",
	"Razor",
	"Riki",
	"Rubick",
	"Sand King",
	"Shadow Demon",
	"Shadow Fiend",
	"Shadow Shaman",
	"Silencer",
	"Skywrath Mage",
	"Slardar",
	"Slark",
	"Sniper",
	"Spectre",
	"Spirit Breaker",
	"Storm Spirit",
	"Sven",
	"Techies",
	"Templar Assassin",
	"Terrorblade",
	"Tidehunter",
	"Timbersaw",
	"Tinker",
	"Tiny",
	"Treant Protector",
	"Troll Warlord",
	"Tusk",
	"Undying",
	"Ursa",
	"Vengeful Spirit",
	"Venomancer",
	"Viper",
	"Visage",
	"Warlock",
	"Weaver",
	"Windranger",
	"Winter Wyvern",
	"Witch Doctor",
	"Wraith King",
	"Zeus"
];
var curr_team = [null, null, null, null, null];

// Ottieni i parametri passati nell'URL via GET
function parseURLParam(val) {
    var result = "Not found",
        tmp = [];
    location.search
    .substr(1)
        .split("&")
        .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
    });
    return result;
}

// Aggiorna i div che contengono le pick
function invalidatePicks() {
	for (var i = 0; i < 5; ++i) {
		// Update the picked heroes
		if(curr_team[i] != null) {
			$('.picked-hero').eq(i)
			.css('background-image', 'url("pics/heroes/' + curr_team[i].toLowerCase() + '.jpg")');
		}
		else {
			$('.picked-hero').eq(i)
			.css('background-image', 'url("pics/unknown_hero.png")');
		}
	}
}

// You can't do that
function meepMerp() {
	var meep = new Audio('audio/meep merp.mp3');
	meep.volume = 0.2;
	meep.play();
}

function selectSlot(idx) {
	$('#selected-slot').removeAttr('id');
	$('.picked-hero').eq(idx).attr('id', 'selected-slot');
}

// Events-----------------------------------------------------------------------
// Evidenzia solo gli eroi matchati dal filtro
$('#roster-filter').keyup(function() {
	var exp = new RegExp(this.value, 'i');
	$('.roster-hero').each(function() {
		if( exp.test($(this).attr('data-hero-name')) ) {
		$(this).removeClass('roster-hero-filtered');
		} else {
			$(this).addClass('roster-hero-filtered');
		}
	});
});

// Seleziona lo slot attuale
$('.picked-hero').click(function() {
	selectSlot($(this).index());
});

// Effettua una pick
$(document).on('click', '.roster-hero', function(e) {
	if($(this).hasClass('roster-hero-picked')) {
		meepMerp();
		return;
	}

	// Rimuovi .roster-hero-picked dall'eroe in questo slot
	var slot_idx = $('#selected-slot').index();
	// curr_team[slot_idx]
	$('.roster-hero-picked').filter(function() {
		return $(this).attr('data-hero-name') == curr_team[slot_idx];
	}).removeClass('roster-hero-picked');
	// Aggiungi l'eroe attuale al team ed aggiungi la classe
	curr_team[slot_idx] = $(this).attr('data-hero-name');
	$(this).addClass('roster-hero-picked');

	invalidatePicks();
	selectSlot(++slot_idx % 5);
});

// Esporta il team
$('#export-btn').click(function() {
	for(var i = 1; i <= 5; ++i) {
		$('#h' + i).val(encodeURIComponent(curr_team[i - 1]));
	}
});

// Main-------------------------------------------------------------------------
// Crea dinamicamente il roster degli eroi
for (hero of hero_list) {
	$('#roster').append("<div class='roster-hero' data-hero-name='"+ hero + "' \
	style='background-image: url(\"pics/heroes/" + hero.toLowerCase() + ".jpg\")'></div>");
}

// Se son stati passati degli eroi via GET, pickali
for(var i = 1; i <= 5; ++i) {
	var hero = decodeURIComponent(parseURLParam('h' + i));
	var idx = hero_list.indexOf(hero);
	if(idx == -1) continue;
	selectSlot(i - 1);
	$('.roster-hero').eq(idx).trigger('click');
}
