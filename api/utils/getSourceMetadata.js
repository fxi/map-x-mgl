const clientPgRead = require.main.require("./db").pgWrite;
const utils = require("./utils.js");
const template = require("../templates");
const zlib = require("zlib");

exports.get =  function(req,res){
  var buffer ;
  var out = {};
  var id = req.params.id;
  var format = req.params.format || "mapx-json" || "iso-xml";
  var sql = "";

  if(!id){
    return res.status(204).send();
  }

  sql = utils.parseTemplate(
    template.getSourceMetadata,
    { 
      idSource: id
    }
  );

  if(!sql){
    return res.status(204).send();
  }

  clientPgRead.query(sql)
    .then(function(result){
      if (result && result.rows) {
        out = result.rows[0];

        if( ! out.metadata) return res.status(204).send();

        buffer = new Buffer(JSON.stringify(out.metadata), 'utf-8');

        zlib.gzip(buffer, function (err, zOut ) {
          if(err){
            return res.status(500).json(err);
          }
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Encoding', 'gzip');

          res.send(zOut);
        });
      }else{
        return res.status(204).send();
      }
    }).catch(function(err){
      return res.status(500).json(err);
    });

};