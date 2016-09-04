using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using quVolition.Models;

namespace quVolition.Controllers {
    public class VolitionsController : ApiController {
        // GET api/values
        public Volition Get() {
            return new Volition { PartitionId = 0, GuestId = "", Selected = new string[] {}, Updated=DateTime.Today};
        }

        // GET api/values/5
        public IEnumerable<Volition> Get( int id ) {
            var db = new VolitionClassesDataContext();
            var pa = db.Partitions.Where(p => id == p.Id).Select(p => p);
            if ( 0 < pa.Count()) {
                var vo = db.Volitions.Where(p => id == p.PartitionId).Select(r => new Volition { PartitionId = r.PartitionId, GuestId = r.GuestId, Selected = r.Selected.Split(','), Updated = r.Updated });
                string[] g = vo.Select(r => r.GuestId).ToArray();
                string[] m = pa.Select(p => p.guests).First().Split(',');
                string[] s = Enumerable.Repeat<string>("-", pa.Select(p => p.sections).First().Split(',').Count()).ToArray();
                var ne = m.Where(r => !g.Contains(r)).Select(r => new Volition { PartitionId = id, GuestId = r, Selected = s });
                var re = vo.ToList();
                re.AddRange(ne.ToList());
                return re;
            }
            return null;
        }

        // GET api/values/?pId=5&gId=005
        // GET api/values/1/005
        [Route("api/Volitions/{pId}/{gId}")]
        public IEnumerable<Volition> GetVolitions( int pId, string gId ) {
            var db = new VolitionClassesDataContext();
            var vo = db.Volitions.Where(r => pId == r.PartitionId && gId == r.GuestId).Select(r => new Volition { PartitionId = r.PartitionId, GuestId = r.GuestId, Selected = r.Selected.Split(','), Updated = r.Updated });
            return vo;
        }

        // POST api/values
        public void Post( [FromBody]IEnumerable<paramVolition> value ) {
            var dt = DateTime.Now;
            var db = new VolitionClassesDataContext();
            foreach ( var pa in value.GroupBy(r => r.PartitionId) ) {
                foreach ( var p in pa ) {
                    try {
                        var vo = db.Volitions.SingleOrDefault(r => pa.Key == r.PartitionId && p.GuestId == r.GuestId);
                        if ( vo == null) {
                            db.Volitions.InsertOnSubmit(new Volitions { PartitionId = pa.Key, GuestId = p.GuestId, Selected = string.Join(",", p.Selected), Updated = dt });
                        } else {
                            vo.Selected = string.Join(",", p.Selected);
                            vo.Updated = dt;
                        }
                    } catch ( ArgumentNullException e ) {
                        Console.Write(e.Message);
                    } catch ( InvalidOperationException e ) {
                        Console.Write(e.Message);
                    }
                }
            }
            db.SubmitChanges();
        }

        // PUT api/values/5
        [Route("api/Volitions/{pId}/{gId}")]
        public void Put( int pId, string gId, [FromBody]paramSelection value ) {
            var db = new VolitionClassesDataContext();
            try {
                var vo = db.Volitions.SingleOrDefault(r => pId == r.PartitionId && gId == r.GuestId);
                if ( vo == null ) {
                    db.Volitions.InsertOnSubmit(new Volitions { PartitionId = pId, GuestId = gId, Selected = string.Join(",", value.Selected), Updated = DateTime.Now });
                } else {
                    vo.Selected = string.Join(",", value.Selected);
                    vo.Updated = DateTime.Now;
                }
            } catch ( ArgumentNullException e ) {
                Console.Write(e.Message);
            } catch ( InvalidOperationException e ) {
                Console.Write(e.Message);
            }
            db.SubmitChanges();
        }

        // DELETE api/values/?pId=5&gId=005
        [Route("api/Volitions/{pId}/{gId}")]
        public void Delete( int pId, string gId ) {
            return;
        }
    }
}