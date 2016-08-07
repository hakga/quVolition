using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace quVolition.Models {
    public class Partition {
        public int Id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string[] sections { get; set; }
        public string[] guests { get; set; }
        public string[] options { get; set; }
        public System.DateTime term { get; set; }
    }
}