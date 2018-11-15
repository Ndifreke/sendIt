let fileSystem = require( "./FileSystem" ).fileSystem;

class DB {

   constructor() {}

   // write parcel file to flat databasee
   writeToDb( data, path ) {
      if ( typeof data === "object" )
         data = JSON.stringify( data, null, "\t" );
      fileSystem.writeFile( path, data );
   }

   initDb( path, any ) {
      let parcelPath = require( "./Parcel" ).path;
      let userPath = require( "./User" ).path;
      let dbTemplate = undefined;
      /* dertermine which db to initialize base on the caller */
      if ( path === parcelPath || !any ) {
         dbTemplate = {
            lastId: 0,
            parcelList: {}
         }
      } else if ( path === userPath || !any ) {
         dbTemplate = {
            lastId: 0,
            userList: {}
         }
      }
      fileSystem.writeFile( path, JSON.stringify( dbTemplate ) )
   }

   // read percel from flat databse
   readDb( path ) {
      try {
         return JSON.parse( fileSystem.readFile( path ) );
      } catch ( exception ) {
         //db may not be a valid json create one and return it;
         this.initDb( path );
         return JSON.parse( fileSystem.readFile( path ) );
      }

   }
}
exports.db = new DB();