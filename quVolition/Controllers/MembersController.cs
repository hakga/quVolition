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

        static string subjectTemplate = "登録依頼";
        static string bodyTemplate = "%name% 様\n以下のサイトにアクセスして、ご登録をお願いします。\n";
        static string registerPage = "/Register.html?pId=%pid%&gId=%gid%";
        // POST: api/Members
        public void Post( [FromBody]paramMailContents value ) {
            int? id = value.PartitionId;
//          var url = Request.RequestUri.GetComponents(UriComponents.SchemeAndServer, UriFormat.UriEscaped) + registerPage;
            var url = getWebConfig("ownURL") + registerPage;
            var partition = new VolitionClassesDataContext().Partitions.Where(p => id == p.Id).Select(p => new { name = p.name, description = p.description }).FirstOrDefault();
            if ( partition != null ) {
                using ( var client = new System.Net.Mail.SmtpClient() ) {
                    var message = new System.Net.Mail.MailMessage();
                    message.From = new System.Net.Mail.MailAddress(value.fromAddr);
                    message.Priority = System.Net.Mail.MailPriority.High;
                    message.Headers["Date"] = DateTime.Now.ToString("r");
                    message.Subject = subjectTemplate + "《" + partition.name + "》";
                    foreach ( var t in value.toList ) {
                        message.Body = bodyTemplate + url;
                        message.Body = message.Body.Replace("%pId%", id.ToString()).Replace("%gId%", t.GuestId).Replace("%name%", t.name);
                        message.To.Clear();
                        message.To.Add(new System.Net.Mail.MailAddress(t.addr));
                        client.Send(message);
                    }
                    client.Dispose();
                }
            }
        }

        // PUT: api/Members/5
        [Route("api/Members/{pId}/{gId}")]
        public void Put( int pId, string gId, [FromBody]paramMessage value ) {
            using ( var client = new System.Net.Mail.SmtpClient() ) {
                var message = new System.Net.Mail.MailMessage();
                message.To.Add(new System.Net.Mail.MailAddress(value.toAddr));
                message.From = new System.Net.Mail.MailAddress(value.fromAddr);
                message.Priority = System.Net.Mail.MailPriority.High;
                message.Headers["Date"] = DateTime.Now.ToString("r");
                message.Subject = value.subject;
                message.Body = value.body;
                message.Body = message.Body.Replace("%parameter%", "/" + pId + "/" + gId);
                client.Send(message);
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
