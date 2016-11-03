using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using quVolition.Models;

namespace quVolition.Controllers {
    public class MailersController : ApiController {
        // GET api/<controller>
        public IEnumerable<string> Get() {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get( int id ) {
            return "value";
        }

        // POST api/<controller>
        public void Post( [FromBody]paramMailContentsFull value ) {
            if ( value.toList == null ) return;
            using ( var client = new System.Net.Mail.SmtpClient() ) {
                var message = new System.Net.Mail.MailMessage();
                message.From = new System.Net.Mail.MailAddress(value.fromAddr);
                message.Headers["Date"] = DateTime.Now.ToString("r");
                message.Subject = value.subject;
                foreach ( var t in value.toList ) {
                    message.Body = value.mailBody;
                    message.Body = message.Body.Replace("%gId%", t.GuestId).Replace("%name%", t.name);
                    message.To.Clear();
                    message.To.Add(new System.Net.Mail.MailAddress(t.addr));
                    client.Send(message);
                }
                client.Dispose();
            }
        }

        // PUT api/<controller>/5
        protected delegate void toAddr( System.Net.Mail.MailAddress addr );
        public void Put( string id, [FromBody]paramMailContentsFull value ) {
            if ( value.toList == null ) return;
            using ( var client = new System.Net.Mail.SmtpClient() ) {
                var message = new System.Net.Mail.MailMessage();
                toAddr ToCcBcc = message.To.Add;
                message.Priority = System.Net.Mail.MailPriority.Normal;
                message.From = new System.Net.Mail.MailAddress(value.fromAddr);
                message.Headers["Date"] = DateTime.Now.ToString("r");
                message.Subject = value.subject;
                message.Body = value.mailBody;
                switch ( id) {
                    case "to":
                        ToCcBcc = message.To.Add;
                        break;
                    case "cc":
                        ToCcBcc = message.CC.Add;
                        break;
                    case "bcc":
                        ToCcBcc = message.Bcc.Add;
                        break;
                }
                foreach ( var t in value.toList ) {
                    ToCcBcc(new System.Net.Mail.MailAddress(t.addr));
                }
                client.Send(message);
                client.Dispose();
            }
        }

        // DELETE api/<controller>/5
        public void Delete( int id ) {
        }
    }
}