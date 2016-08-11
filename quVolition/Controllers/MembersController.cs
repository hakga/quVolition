using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using quVolition.Models;

namespace quVolition.Controllers
{
    public class MembersController : ApiController
    {
        // GET: api/Members
        public IEnumerable<string> Get() {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Members/5
        public string Get(int id) {
            return "value";
        }

        // POST: api/Members
        public void Post( int id, [FromBody]paramMessage value ) {
            using ( var client = new System.Net.Mail.SmtpClient(getWebConfig("MailServerHost"), 25) ) {
                var message = new System.Net.Mail.MailMessage();
                message.From = new System.Net.Mail.MailAddress(value.fromAddr);
                var guests = value.toAddr;
                if ( guests.Count() <= 0) {
                    guests = new VolitionClassesDataContext().Partitions.Where(p => id == p.Id).Select(p => p.guests).FirstOrDefault().Split(',');
                }
                foreach ( var t in guests) {
                    message.To.Add(new System.Net.Mail.MailAddress(t));
                }
                message.Priority = System.Net.Mail.MailPriority.High;
                message.Headers["Date"] = DateTime.Now.ToString("r");
                message.Subject = value.subject;
                message.Body = value.body;
                client.Send(message);
                client.Dispose();
            }
        }

        // PUT: api/Members/5
        public void Put(int id, [FromBody]paramMessage value ) {
            using ( var client = new System.Net.Mail.SmtpClient(getWebConfig("MailServerHost"), 25) ) {
                var message = new System.Net.Mail.MailMessage();
                message.From = new System.Net.Mail.MailAddress(value.fromAddr);
                message.Priority = System.Net.Mail.MailPriority.High;
                message.Headers["Date"] = DateTime.Now.ToString("r");
                message.Subject = value.subject;
                var guests = value.toAddr;
                if ( guests.Count() <= 0 ) {
                    guests = new VolitionClassesDataContext().Partitions.Where(p => id == p.Id).Select(p => p.guests).FirstOrDefault().Split(',');
                }
                foreach ( var t in guests ) {
                    message.To.Clear();
                    message.To.Add(new System.Net.Mail.MailAddress(t));
                    message.Body = value.body.Replace("%pId%", id.ToString()).Replace( "%gId%", t);
                    client.Send(message);
                }
                client.Dispose();
            }
        }

        // DELETE: api/Members/5
        public void Delete(int id) {
        }

        private string getWebConfig ( string key ) {
            System.Configuration.Configuration config = System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration(null);
            if ( 0 < config.AppSettings.Settings.Count ) {
                System.Configuration.KeyValueConfigurationElement setting = config.AppSettings.Settings[key];
                if ( null != setting ) {
                    return setting.Value;
                }
            }
            return null;
        }

    }
}
