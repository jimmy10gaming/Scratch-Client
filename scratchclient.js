let decoder = new TextDecoder();
let listPseudos;

let select = document.createElement('select');

select.addEventListener('mousedown', function (e) {
    if (Minecraft.$theWorld) {
        select.innerHTML = "";
        listPseudos = [];
        Minecraft.$theWorld.$playerEntities.$array1.data.forEach(element => {
            if (element) {
                listPseudos.push(decoder.decode(new Uint8Array(element.$getName().$characters.data)));
            }
        });
        listPseudos.forEach(element => {
            let option = document.createElement('option');
            option.innerText = element + ((listPseudos.indexOf(element) === 0)?" (you)":"");
            option.value = element;
            select.appendChild(option);
        });
        if (document.querySelector(`option[value="${Minecraft.$renderViewEntity.$getName()}"]`)) {
            document.querySelector(`option[value="${Minecraft.$renderViewEntity.$getName()}"]`).toggleAttribute('selected');
        }
    }
})

function keepLoadedPlayer() {
    if (profile !== Minecraft.$thePlayer) {
        Minecraft.$renderViewEntity = Minecraft.$thePlayer;
        setTimeout(function() {Minecraft.$renderViewEntity = profile;}, 0);
    }
}

select.addEventListener('change', function (e) {
    window.profile = Minecraft.$theWorld.$playerEntities.$array1.data.find(function (element) {
        if (element) {
            return element.$getName() == select.value;
        } else {
            return null;
        }
    });
    if (profile) {
        Minecraft.$renderViewEntity = profile;
        if (typeof(keepLoadedPlayerInterval) !== "undefined") {
            clearInterval(keepLoadedPlayerInterval);
        }
        if (profile === Minecraft.$thePlayer) {
            Minecraft.$gameSettings.$hideGUI = 0;
        } else {
            Minecraft.$gameSettings.$hideGUI = 1;
            window.keepLoadedPlayerInterval = setInterval(keepLoadedPlayer, 1000);
        }
    }
})

ModAPI.addEventListener("frame", () => {
    if (Minecraft.$theWorld && Minecraft.$theWorld.$playerEntities.$array1.data.length > 1) {
        select.style.display = "unset";
    } else {
        select.style.display = "none";
    }
})

select.style.position = "absolute";
select.style.top = "0px";
select.style.left = "0px";

document.body.appendChild(select);

ModAPI.require("player");
ModAPI.require("settings");
let playerFound = false;

function checkForGame() {
    if (typeof ModAPI.player !== 'undefined') {
        playerFound = true;
    } else {
        console.log('Player doesn\'t exist yet, please join a server or singleplayer world...');
    }
}

checkForGame();

const intervalId = setInterval(() => {
    if (playerFound) {
        clearInterval(intervalId); // Stop the interval
        ModAPI.displayToChat({msg: "§5StatsHud is now loading"})
        initializeHud();
    } else {
        checkForGame();
    }
}, 1000);

function initializeHud() {
    setTimeout(async function () {
        const url_to_font_name =
            "https://raw.githubusercontent.com/AstralisLLC/fonts/main/PressStart2P.ttf";
        const font_name = new FontFace("pressStart", `url(${url_to_font_name})`);
        await font_name.load();
        document.fonts.add(font_name);

        ModAPI.settings.hud24h = false
        ModAPI.settings.hudCoords = false
        ModAPI.settings.hudFps = false
        ModAPI.settings.hudPlayer = false
        ModAPI.settings.hudStats = false
        ModAPI.settings.hudWorld = false
        ModAPI.settings.reload();   
        
        const statDisplay = document.createElement("div");
        document.body.appendChild(statDisplay);
        statDisplay.id = "statsHUD";
        statDisplay.style.position = "fixed";
        statDisplay.style.width = "350px";
        statDisplay.style.height = "160px";
        statDisplay.style.top = "10px";
        statDisplay.style.left = "10px";
        statDisplay.style.background = "rgba(0, 0, 0, 0.7)";
        statDisplay.style.zIndex = "1000";
        statDisplay.style.boxShadow = "0 0 30px #00ffee";
        statDisplay.style.borderRadius = "20px";
        statDisplay.style.backdropFilter = "blur(3px)";
        
        const fpsStr = document.createElement("p");
        statDisplay.appendChild(fpsStr);
        fpsStr.style.fontFamily = "'pressStart', sans-serif";
        fpsStr.style.color = "#00ffee";
        fpsStr.style.fontSize = "14px";
        fpsStr.style.marginLeft = "15px";
        function updateFPS() {
            fpsStr.innerText = "FPS: " + ModAPI.getFPS();
        }
        
        const xStr = document.createElement("p");
        statDisplay.appendChild(xStr);
        xStr.style.fontFamily = "'pressStart', sans-serif";
        xStr.style.color = "#00ffee";
        xStr.style.fontSize = "14px";
        xStr.style.marginLeft = "15px";
        function updateX() {
            xStr.innerText = "X: " + Math.floor(ModAPI.player.lastReportedPosX)
        }
        
        const yStr = document.createElement("p");
        statDisplay.appendChild(yStr);
        yStr.style.fontFamily = "'pressStart', sans-serif";
        yStr.style.color = "#00ffee";
        yStr.style.fontSize = "14px";
        yStr.style.marginLeft = "15px";
        function updateY() {
            yStr.innerText = "Y: " + Math.floor(ModAPI.player.lastReportedPosY)
        }
        
        const zStr = document.createElement("p");
        statDisplay.appendChild(zStr);
        zStr.style.fontFamily = "'pressStart', sans-serif";
        zStr.style.color = "#00ffee";
        zStr.style.fontSize = "14px";
        zStr.style.marginLeft = "15px";
        function updateZ() {
            zStr.innerText = "Z: " + Math.floor(ModAPI.player.lastReportedPosZ)
        }
        
        const timeStr = document.createElement("p");
        statDisplay.appendChild(timeStr);
        timeStr.style.fontFamily = "'pressStart', sans-serif";
        timeStr.style.color = "#00ffee";
        timeStr.style.fontSize = "14px";
        timeStr.style.marginLeft = "15px";
        function updateTime() {
    
            const currentDate = new Date();
    
            const hours = currentDate.getHours();
    
            const period = hours < 12 ? 'AM' : 'PM';
            timeStr.innerText = `Time: ${hours}:${currentDate.getMinutes()}:${currentDate.getSeconds()} \[${period}\]`
        }
        
        setInterval(updateTime, 10)
        setInterval(updateZ, 10)
        setInterval(updateY, 10)
        setInterval(updateX, 10);
        setInterval(updateFPS, 10);
    
        let hudVisible = false;
        statDisplay.style.visibility = hudVisible ? "visible" : "hidden";
    
        function checkLoaded() {
            if (document.pointerLockElement != null){
                hudVisible = true;
                statDisplay.style.visibility = hudVisible ? "visible" : "hidden";
            } else {
                hudVisible = false;
                statDisplay.style.visibility = hudVisible ? "visible" : "hidden";
            }
        }
    
        setInterval(checkLoaded, 1);
    
        ModAPI.clientBrand = "Astralis\'s UI Loader"
        ModAPI.displayToChat({msg: "§5StatsHud has succesfully loaded!"})

        setTimeout(function() {

        const thanksContainer = document.createElement("div");
        document.body.appendChild(thanksContainer);
        thanksContainer.style.position = "fixed";
        thanksContainer.style.fontFamily = "'pressStart', sans-serif";
        thanksContainer.style.width = "375px";
        thanksContainer.style.height = "55px";
        thanksContainer.style.top = "50%";
        thanksContainer.style.left = "50%";
        thanksContainer.style.transform = "translate(-50%, -50%)"; // Center the div
        thanksContainer.style.background = "rgba(0, 0, 0, 0.7)";
        thanksContainer.id = "thanksContainer";
        thanksContainer.style.borderRadius = "20px";
        thanksContainer.style.zIndex = "1001"; // Set a higher z-index than clientTitle
        thanksContainer.style.display = "grid";
        thanksContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
        thanksContainer.style.gridTemplateRows = "repeat(2, 1fr)";
        thanksContainer.style.gap = "10px";
        thanksContainer.style.boxShadow = "0 0 30px #00ffee"; // Light blue glow with 30px blur radius
        thanksContainer.style.backdropFilter = "blur(3px)";
        thanksContainer.style.transition = "opacity 1s ease-in-out"; // Add transition for opacity

        // Create the animated paragraph element
        const animatedParagraph = document.createElement("p");
        thanksContainer.appendChild(animatedParagraph);
        animatedParagraph.innerText = "Thanks for using our mods!";

        // Apply styles for animation
        animatedParagraph.style.animation = "fade-in-out 2s ease-in-out infinite";
        animatedParagraph.style.whiteSpace = "nowrap";
        animatedParagraph.style.position = "fixed";
        animatedParagraph.style.top = "50%";
        animatedParagraph.style.left = "50%";
        animatedParagraph.style.transform = "translate(-50%, -135%)";

        // Define the CSS keyframes for the fading animation
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(`
            @keyframes fade-in-out {
                0% {
                    color: #00ffee;
                }
                50% {
                    color: #0055aa;
                }
                100% {
                    color: #00ffee;
                }
            }
        `, styleSheet.cssRules.length);

        // Adjust other styles as needed
        animatedParagraph.style.fontFamily = "'pressStart', sans-serif";
        animatedParagraph.style.fontSize = "14px";
        animatedParagraph.style.alignSelf = "center";

        // Delayed fade-out effect after 2.5 seconds
        setTimeout(() => {
            thanksContainer.style.opacity = "0";
        }, 2500);

        }, 1500);

    }, 50);
}

// §




//Coalest xray mod to ever exist!

//IIFE. I like scoped variables.
(function () {
    var enabled = false
    ModAPI.addEventListener("key", function(ev){
        if(ev.key == 45){// the "x" key
          if(enabled){
                disable()
                enabled = false
          } else{
                update(); //Trigger the coal xray.
                enabled = true
          }
        }
    })
    var targets = ["diamond_block","diamond_ore","gold_block","gold_ore","iron_block","iron_ore","coal_block","coal_ore","emerald_ore","emerald_block","redstone_ore","redstone_block","lapis_ore","lapis_block","chest","furnace","lit_furnace","ender_chest"]; //The target blocks
    var allblocks = Object.keys(ModAPI.blocks); //List of all block IDsw
    function update() {
      ModAPI.displayToChat({msg: "xray Enabled!"})
      allblocks.forEach(block=>{ //Loop through all the blocks
        if (targets.includes(block)) { //If it is in the targets list, force it to render.
          ModAPI.blocks[block].forceRender = true;
          ModAPI.blocks[block].reload(); //Push the changes.
        } else if (ModAPI.blocks[block] && ("noRender" in ModAPI.blocks[block])) { //Otherwise, if it is a valid block, and can be set to not render, do so.
          ModAPI.blocks[block].noRender = true;
          ModAPI.blocks[block].reload(); //Push the changes.
        }
      });
      ModAPI.reloadchunks()
    }
    function disable(){
      ModAPI.displayToChat({msg: "xray Disabled!"})
              allblocks.forEach(block=>{ //Loop through all the blocks
 if (ModAPI.blocks[block] && ("noRender" in ModAPI.blocks[block])) { 
          ModAPI.blocks[block].noRender = false;
          ModAPI.blocks[block].reload(); //Push the changes.
        }
      });
    ModAPI.reloadchunks()
    }
  })();
