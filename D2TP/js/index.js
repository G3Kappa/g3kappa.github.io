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
var curr_team = [];

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
		if(curr_team[i]) {
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

// Rimuovi la pick selezionata
$('.picked-hero').click(function() {
	var idx = hero_list.indexOf(curr_team[$(this).index()]);
	// Togli l'effetto applicato agli eroi pickati
	$('.roster-hero').eq(idx).removeClass('roster-hero-picked');
	// Togli l'eroe dal team
	curr_team.splice($(this).index(), 1);

	invalidatePicks();
});

// Effettua una pick o usa mouse2 per de-pickare un eroe
$(document).on('click', '.roster-hero', function(e) {
	var i = curr_team.length;
	if(i == 5) {
		meepMerp();
		return;
	}

	curr_team[i] = $(this).attr('data-hero-name');
	var len = curr_team.length;
	// Impedisci di pickare due volte lo stesso eroe
	curr_team = $.unique(curr_team);
	if(len != curr_team.length) {
		meepMerp();
	}

	// Applica uno stile visivo all'eroe pickato
	$(this).addClass('roster-hero-picked');
	invalidatePicks();
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

	$('.roster-hero').eq(idx).trigger('click');
}
