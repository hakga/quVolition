﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace quVolition.Models {
    public class paramSelection {
        public string[] Selected { get; set; }
    }
    public class paramPartition {
        public string name { get; set; }
        public string description { get; set; }
        public string[] sections { get; set; }
        public string[] guests { get; set; }
        public string[] options { get; set; }
        public System.DateTime term { get; set; }
    }
    public class paramVolition {
        public int PartitionId { get; set; }
        public string GuestId { get; set; }
        public string[] Selected { get; set; }
    }
    public class paramMessage {
        public string toAddr { get; set; }
        public string toName { get; set; }
        public string fromAddr { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
    }
    public class paramMailContents {
        public int PartitionId { get; set; }
        public string fromAddr { get; set; }
        public paramToList[] toList { get; set; }
    }
    public class paramToList {
        public string GuestId { get; set; }
        public string name { get; set; }
        public string addr { get; set; }
    }
    public class paramMailContentsFull {
        public string fromAddr { get; set; }
        public paramToList[] toList { get; set; }
        public string subject { get; set; }
        public string mailBody { get; set; }
    }
}