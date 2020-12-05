// Read a file and put the contents in an element
function ReadTxtToHTML(elementID, fileName){
	var RDTHxhttp = new XMLHttpRequest();
  	RDTHxhttp.onreadystatechange =function() {
		if(this.readyState == 4){
			SetElementHTML(elementID, this.responseText)
		}
	};
  	RDTHxhttp.open("GET", fileName);
	RDTHxhttp.send();
};


// Read an *.ini file and put the value of a specific key in an element
function ReadIniToHTML(elementID, fileName, section, key){
	var RDTHxhttp = new XMLHttpRequest();
  	RDTHxhttp.onreadystatechange =function() {
		if(this.readyState == 4){
			IniData = IniRead(this.responseText)
			SetElementHTML(elementID, IniData[section][key])
		}
	};
  	RDTHxhttp.open("GET", fileName);
	RDTHxhttp.send();
};

// Read an *.ini file to get the counter start point
function IniToCounter(elementID, fileName, section, key){
	var RDTHxhttp = new XMLHttpRequest();
  	RDTHxhttp.onreadystatechange =function() {
		if(this.readyState == 4){
			IniData = IniRead(this.responseText)
			countdownTimer(elementID, IniData[section][key])
		}
	};
  	RDTHxhttp.open("GET", fileName);
	RDTHxhttp.send();
};


// Control the top bar on the Valorant scene
var CurrentValorantTopBar = "Blank";
function ValorantTopBar(){
	var Vxhttp = new XMLHttpRequest();
  	Vxhttp.onreadystatechange = function() {
		if(this.readyState == 4){
			IniData = IniRead(this.responseText);
			if(Vxhttp.responseText != IniData["Overlay"]["TopBar"]){
				if(IniData["Overlay"]["TopBar"] == "hide"){
					ClassSwap("valorant-top-bar-mask-left", "valorant-top-bar-mask-left-show", "valorant-top-bar-mask-left-hide");
					ClassSwap("valorant-top-bar-mask-right", "valorant-top-bar-mask-right-show", "valorant-top-bar-mask-right-hide");
					ClassSwap("valorant-team-left", "valorant-team-left-show", "valorant-team-left-hide");
					ClassSwap("valorant-team-right", "valorant-team-right-show", "valorant-team-right-hide");

				} else {
					ClassSwap("valorant-top-bar-mask-left", "valorant-top-bar-mask-left-hide", "valorant-top-bar-mask-left-show");
					ClassSwap("valorant-top-bar-mask-right", "valorant-top-bar-mask-right-hide", "valorant-top-bar-mask-right-show");
					ClassSwap("valorant-team-left", "valorant-team-left-hide", "valorant-team-left-show");
					ClassSwap("valorant-team-right", "valorant-team-right-hide", "valorant-team-right-show");
				}
				CurrentValorantTopBar = this.responseText;
			}
		}
	};
  	Vxhttp.open("GET", "settings.ini");
	Vxhttp.send();
};


// Banner rotater
// SwapBanner(Id of the container,Which element to start with (1 for the top one),Time in seconds to hold main element (first one), Time in seconds to hold other elements)
function SwapBanner(containerID,startEl,mainElTimer,genElTimer){
	
	var curEl = startEl;
	var numEl = document.getElementById(containerID).childElementCount;
	
	if(curEl > numEl){
		curEl = 1;
	}
	
	for (i = 1; i <= numEl; i++) {
	  document.querySelector("#" + containerID + " :nth-child(" + i + ")").id = containerID + "-child" + i;
	}
	
	var theTimer = genElTimer * 1000;
	var toRemove = containerID + "-child" + (curEl - 1);
	
	if(curEl == 1){
		theTimer = mainElTimer * 1000;
		toRemove = containerID + "-child" + numEl
	}
	
	//console.log("timer is " + theTimer + " and to remove is " + toRemove)
	
	ClassSwap(toRemove, "OpacityFull", "null");
	ClassSwap(containerID + "-child" + curEl, "null", "OpacityFull");

	curEl++;

	setTimeout(SwapBanner,theTimer,containerID,curEl,mainElTimer,genElTimer);
}


/* --------------------------------
   Support functions
-------------------------------- */


// Parse *.ini format data
function IniRead(data){
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/[\r\n]+/);
    var section = null;
    lines.forEach(function(line){
        if(regex.comment.test(line)){
            return;
        }else if(regex.param.test(line)){
            var match = line.match(regex.param);
            if(section){
                value[section][match[1]] = match[2];
            }else{
                value[match[1]] = match[2];
            }
        }else if(regex.section.test(line)){
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }else if(line.length == 0 && section){
            section = null;
        };
    });
    return value;
}


// Swap classes of an elements
function ClassSwap(elementID, removeClass, addClass){
    let el = document.getElementById(elementID);
	if (el.classList.contains(removeClass)) {
  		el.classList.remove(removeClass);
	};
	if (el.classList.contains(addClass)) {
  		el.classList.remove(addClass);
	};
	el.classList.add(addClass);
}


// Change the HTML of an element
function SetElementHTML(elementID, data){
	document.getElementById(elementID).innerHTML = data;
}

// Countdown timer function
function countdownTimer(elementID,fromSeconds){
	if(fromSeconds > 0){
		var miliseconds = fromSeconds * 1000;
		var minutes = Math.floor((miliseconds % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((miliseconds % (1000 * 60)) / 1000);
		
		s = seconds+"";
		while (s.length < 2) s = "0" + s;
		
		SetElementHTML(elementID, minutes + ":" + s);
		
		fromSeconds--;
		
		setTimeout(countdownTimer,1000,elementID,fromSeconds);
	} else {
		SetElementHTML(elementID, "")
	}
}

// Play background music
function BackgroundMusicLoop(songs,theVolume){
	var AudioID = "backgroundmusic" + Date.now();
	document.getElementById("container-main").insertAdjacentHTML("beforeend", '<audio id="' + AudioID + '" src="" type="audio/mpeg">');
	var thePlayer = document.getElementById(AudioID);
	thePlayer.volume = theVolume / 100;
	var currentSong = 0;
	
	thePlayer.setAttribute('src', songs[currentSong]);
	thePlayer.currentTime = 0;
	thePlayer.play();
		
	thePlayer.onended = function(){
		currentSong++;
		if(currentSong > songs.length - 1){
			currentSong = 0;
		}
		thePlayer.setAttribute('src', songs[currentSong]);
		thePlayer.currentTime = 0;
		thePlayer.play();
	};
}

// Used mostly for shuffling the background music
function shuffle(array) {
  	var currentIndex = array.length, temporaryValue, randomIndex;

  	while (0 !== currentIndex) {

		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
  	}

  	return array;
}
// Load tree data into page
function LoadTournamentTree(containerID){
	
	var RDTHxhttp = new XMLHttpRequest();
  	RDTHxhttp.onreadystatechange =function() {
		if(this.readyState == 4){
			
			IniData = IniRead(this.responseText)
			
			var numColumns = document.getElementById(containerID).childElementCount;
	
			for (i = 1; i <= numColumns; i++) {
				var currentColumn = document.querySelector("#" + containerID + " div:nth-child(" + i + ")");
				var columnChildren = currentColumn.children

				console.log("Column " + i + " has " + columnChildren.length + " children")

				for (x = 0; x < columnChildren.length; x++) {
					var theKey = i + "-" + (x + 1);
					var theData = IniData["Tournament"][theKey];
					if(theData === ""){
						theData = "&nbsp;";
					}
					columnChildren[x].innerHTML = theData;
				}
			}
		}
	};
  	RDTHxhttp.open("GET", "settings.ini");
	RDTHxhttp.send();
};