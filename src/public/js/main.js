
$(document).ready(function () {
 

  if (localStorage.getItem('tema')) {
    $("#select-tema").attr("href", localStorage.getItem('tema'));
  }
  if (window.location.href.indexOf("index") > 1) {
    $('.bxslider').bxSlider({
      auto: true,
      stopAutoOnClick: true,
      pager: true,
      captions: true,
      slideWidth: 600
    });
    //POST
    var poss = [
      {
        titulo: 'Nier:Replicant',
        fecha: 'Es ' + moment().format("Do") + ' de ' + moment().format("MMMM") + ' del ' + moment().format('YYYY'),// "Do" número
        contenido: 'NieR Replicant ver.1.22474487139... es una versión actualizada de NieR Replicant, lanzado originalmente en Japón. Descubre una precuela única para la obra maestra NieR:Automata, un título que ha recibido excelentes críticas. ¡Con esta modernización disfrutarás de unos gráficos cuidadosamente renovados, una historia fascinante y muchas cosas más! El protagonista es un bondadoso joven de una aldea remota que, con el objetivo de salvar a su hermana Yonah, que sufre una enfermedad letal conocida como necrosis rúnica, se dispone a buscar los Versos sellados en compañía del extraño libro parlante Grimoire Weiss. '
      },
      {
        titulo: 'Nier:Autómata',
        fecha: new Date(),
        contenido: 'NieR: Automata narra la historia de los androides 2B, 9S y A2, que luchan para recuperar el mundo distópico dirigido por las máquinas que han invadido unas poderosas formas de vida mecánicas. Unos alienígenas mecanizados han invadido la Tierra, obligando a la humanidad a abandonarla. En un último intento por recuperar el planeta, la resistencia humana envía un ejército de soldados androides para acabar con los invasores. La guerra entre las máquinas y los androides se vuelve cada vez más encarnizada. Una guerra que pronto pondrá al descubierto la verdad sobre este mundo...'
      },
      {
        titulo: 'RE VIII',
        fecha: new Date(),
        contenido: 'No se ha lanzado'
      },
      {
        titulo: 'Devil May Cry 5',
        fecha: new Date(),
        contenido:'Devil May Cry 5 es un videojuego perteneciente al género hack and slash, desarrollado y publicado por la empresa Capcom. Fue lanzado el 8 de marzo de 2019, para las plataformas PlayStation 4, Xbox One y Microsoft Windows.​Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod temoccaecat cupidatat non '
      }
    ];
    //obtener los objetos y pasarlos a html
    poss.forEach((value, index) => {//bucle para obtener las pocisiones de cada objeto 
      var post = ` <article  class="post">
        <h2>${value.titulo}</h2>
        <span class="fecha">${value.fecha}</span> 
        <button class="comenta">Comentarios</button>
        <p>
          ${value.contenido}
        </p>
        <a href="" class="more">leer más</a>
        </article>
      `;

      
       
      var posts = $("#posts");
      posts.append(post);/*Los post los mete en el mismo  <div id=posts*/


    });
  }

  $(".red").click(function () {
    $("#select-tema").attr("href", "css/theme-red.css");
    localStorage.setItem("tema", "css/theme-red.css");
  });

  $(".blue").click(function () {
    $("#select-tema").attr("href", "css/theme-blue.css");
    localStorage.setItem("tema", "css/theme-blue.css");
  });
  $(".purple").click(function () {
    $("#select-tema").attr("href", "css/theme-purple.css");
    localStorage.setItem("tema", "css/theme-purple.css");
  });
  $(".subir").fadeOut();
  $(window).scroll(function () {      //altura ventana,   scroll ventana
    //console.log($(document).height(), $(window).height(),$(window).scrollTop()); 
    if ($(this).scrollTop() > 1190) {
      $(".subir").fadeIn();
    } else {
      $(".subir").fadeOut();
    }
  });
 
  $(".subir").click((e) => {
    e.preventDefault();/*parauqe link no lleve a otro sitio, aunque veo diferencia -_-*/

    $("html, body").animate({
      scrollTop: 0
    }, 500);
 


    return false;
  });
  //registro
  $("#form_contact").submit(function (){
      let nombre = $("#nombre").val();
      let correro = $("#correor").val();
      console.log(correo);
      localStorage.setItem("name", nombre);
      localStorage.setItem("email", correro);
      });

  //login

  $("#login").submit(function () {
    var name = $("#name").val();
    var email = $("#correo").val();
    var password = $("#password").val();
    if (localStorage.getItem("email") == email) {// && localStorage.getItem("password")==password

      $("#login h4").html("Hola " + localStorage.getItem("name"));
      $("#login h4").append('<a id="logout" href="#">  Cerrar sesión</a>')
      $("#login form").hide();

      $("#logout").click(function () {
        console.log("Cerrando");
        $("#login form").show();

      });

    } else {
      console.log("No");
    }
    return false;
  });
//ACORDEON
  if (window.location.href.indexOf("about") > 1) {
    $("#acordeon").accordion();
  }

  //RELOJ
  if (window.location.href.indexOf("reloj") > 1) {
    var reloj, reloj2;
    setInterval(()=>{
      reloj=moment().locale("es-mx").format('h:mm:ss a, dddd Do MMMM YYYY');  /*o moment().locale("es-mx").format("LL");*/
      reloj2=moment().add(7, 'hours').locale("es").format('h:mm:ss a, dddd Do MMMM YYYY');
      $("#reloj").html(reloj);
      $("#reloj2").html(reloj2);
    },100)
   
  }
  if (window.location.href.indexOf("contact") > 1) {
    $.validate({
      lang: 'es',
      errorMessagePosition: 'top',
      scrollToTopOnError: true
    });
    
    $("#date").datepicker({
      dateFormat: 'dd-mm-yy'
    });
  }
 


});
