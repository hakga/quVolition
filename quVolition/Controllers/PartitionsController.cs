using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using quVolition.Models;

namespace quVolition.Controllers {
    public class PartitionsController : ApiController {
        // GET api/values
        public IEnumerable<Partition> Get() {
            var db = new VolitionClassesDataContext();
            return db.Partitions.Where(p => DateTime.Today.AddDays(1) < p.term).Select(p => new Partition { Id = p.Id, name = p.name, description = p.description, guests = p.guests.Split(','), sections = p.sections.Split(','), options = p.options.Split(','), term = p.term });
        }
        public IEnumerable<Partition> Get( int id ) {
            var db = new VolitionClassesDataContext();
            return db.Partitions.Where(p => id == p.Id).Select(p => new Partition { Id = p.Id, name = p.name, description = p.description, guests = p.guests.Split(','), sections = p.sections.Split(','), options = p.options.Split(','), term = p.term });
        }

        // POST api/values
        public void Post( [FromBody]paramPartition value ) {
            var db = new VolitionClassesDataContext();
            db.Partitions.InsertOnSubmit(new Partitions { name = value.name, description = value.description, guests = string.Join(",", value.guests), sections = string.Join(",", value.sections), options = string.Join(",", value.options), term = value.term });
            try {
                db.SubmitChanges();
            } catch ( Exception e ) {
                Console.Write(e.Message);
            }
        }

        // PUT api/values/5
        public void Put( int id, [FromBody]paramPartition value ) {
            var db = new VolitionClassesDataContext();
            try {
                var pa = db.Partitions.Single(p => id == p.Id);
                pa.name = value.name;
                pa.description = value.description;
                pa.guests = string.Join(",", value.guests);
                pa.sections = string.Join(",", value.sections);
                pa.options = string.Join(",", value.options);
                pa.term = value.term;
                db.SubmitChanges();
            } catch ( Exception e ) {
                Console.Write(e.Message);
            }
        }

        // DELETE api/values/5
        public void Delete( int id ) {
            var db = new VolitionClassesDataContext();
            var pa = db.Partitions.Where(p => id == p.Id);
            db.Partitions.DeleteAllOnSubmit(pa);
            var vo = db.Volitions.Where(p => id == p.PartitionId);
            db.Volitions.DeleteAllOnSubmit(vo);
            try {
                db.SubmitChanges();
            } catch ( Exception e ) {
                Console.Write(e.Message);
            }
        }
    }
}