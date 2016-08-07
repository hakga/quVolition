using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace quVolition.Models {
    public class Volition {
        public int PartitionId { get; set; }
        public string GuestId { get; set; }
        public string[] Selected { get; set; }
        public System.DateTime Updated { get; set; }
    }
}