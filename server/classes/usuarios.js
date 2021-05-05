


class Usuarios {

    personas = [];
    
    contructor(){}

    agregarPersona( id, nombre, sala ){
        let persona = { id, nombre, sala }
        this.personas.push(persona);
        //this.personas[this.personas.length]=persona;
        return this.personas;
    }

    getPersona( id ){
        let persona = this.personas.filter( persona => persona.id === id )[0];
        return persona;
    }

    getPersonas(){
        return this.personas;
    }

    getPersonasPorSala(sala){
        let personaEnSala = this.personas.filter( persona =>  persona.sala === sala);
        return personaEnSala;
    }

    borrarPersona( id ){
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter( persona =>  persona.id != id );
    
        return personaBorrada;
    }


}

module.exports = {
    Usuarios
}