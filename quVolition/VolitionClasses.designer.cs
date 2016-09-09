﻿#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     このコードはツールによって生成されました。
//     ランタイム バージョン:4.0.30319.42000
//
//     このファイルへの変更は、以下の状況下で不正な動作の原因になったり、
//     コードが再生成されるときに損失したりします。
// </auto-generated>
//------------------------------------------------------------------------------

namespace quVolition
{
	using System.Data.Linq;
	using System.Data.Linq.Mapping;
	using System.Data;
	using System.Collections.Generic;
	using System.Reflection;
	using System.Linq;
	using System.Linq.Expressions;
	using System.ComponentModel;
	using System;
	
	
	[global::System.Data.Linq.Mapping.DatabaseAttribute(Name="quVolition")]
	public partial class VolitionClassesDataContext : System.Data.Linq.DataContext
	{
		
		private static System.Data.Linq.Mapping.MappingSource mappingSource = new AttributeMappingSource();
		
    #region 拡張メソッドの定義
    partial void OnCreated();
    partial void InsertPartitions(Partitions instance);
    partial void UpdatePartitions(Partitions instance);
    partial void DeletePartitions(Partitions instance);
    partial void InsertVolitions(Volitions instance);
    partial void UpdateVolitions(Volitions instance);
    partial void DeleteVolitions(Volitions instance);
    #endregion
		
		public VolitionClassesDataContext() : 
				base(global::System.Configuration.ConfigurationManager.ConnectionStrings["quVolitionConnectionString"].ConnectionString, mappingSource)
		{
			OnCreated();
		}
		
		public VolitionClassesDataContext(string connection) : 
				base(connection, mappingSource)
		{
			OnCreated();
		}
		
		public VolitionClassesDataContext(System.Data.IDbConnection connection) : 
				base(connection, mappingSource)
		{
			OnCreated();
		}
		
		public VolitionClassesDataContext(string connection, System.Data.Linq.Mapping.MappingSource mappingSource) : 
				base(connection, mappingSource)
		{
			OnCreated();
		}
		
		public VolitionClassesDataContext(System.Data.IDbConnection connection, System.Data.Linq.Mapping.MappingSource mappingSource) : 
				base(connection, mappingSource)
		{
			OnCreated();
		}
		
		public System.Data.Linq.Table<Partitions> Partitions
		{
			get
			{
				return this.GetTable<Partitions>();
			}
		}
		
		public System.Data.Linq.Table<Volitions> Volitions
		{
			get
			{
				return this.GetTable<Volitions>();
			}
		}
	}
	
	[global::System.Data.Linq.Mapping.TableAttribute(Name="dbo.Partitions")]
	public partial class Partitions : INotifyPropertyChanging, INotifyPropertyChanged
	{
		
		private static PropertyChangingEventArgs emptyChangingEventArgs = new PropertyChangingEventArgs(String.Empty);
		
		private int _Id = default(int);
		
		private string _name;
		
		private string _description;
		
		private string _sections;
		
		private string _guests;
		
		private string _options;
		
		private System.DateTime _term;
		
    #region 拡張メソッドの定義
    partial void OnLoaded();
    partial void OnValidate(System.Data.Linq.ChangeAction action);
    partial void OnCreated();
    partial void OnnameChanging(string value);
    partial void OnnameChanged();
    partial void OndescriptionChanging(string value);
    partial void OndescriptionChanged();
    partial void OnsectionsChanging(string value);
    partial void OnsectionsChanged();
    partial void OnguestsChanging(string value);
    partial void OnguestsChanged();
    partial void OnoptionsChanging(string value);
    partial void OnoptionsChanged();
    partial void OntermChanging(System.DateTime value);
    partial void OntermChanged();
    #endregion
		
		public Partitions()
		{
			OnCreated();
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_Id", DbType="Int NOT NULL", IsPrimaryKey=true, IsDbGenerated=true, UpdateCheck=UpdateCheck.Never)]
		public int Id
		{
			get
			{
				return this._Id;
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_name", DbType="NVarChar(16)")]
		public string name
		{
			get
			{
				return this._name;
			}
			set
			{
				if ((this._name != value))
				{
					this.OnnameChanging(value);
					this.SendPropertyChanging();
					this._name = value;
					this.SendPropertyChanged("name");
					this.OnnameChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_description", DbType="NVarChar(50)")]
		public string description
		{
			get
			{
				return this._description;
			}
			set
			{
				if ((this._description != value))
				{
					this.OndescriptionChanging(value);
					this.SendPropertyChanging();
					this._description = value;
					this.SendPropertyChanged("description");
					this.OndescriptionChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_sections", DbType="NVarChar(50)")]
		public string sections
		{
			get
			{
				return this._sections;
			}
			set
			{
				if ((this._sections != value))
				{
					this.OnsectionsChanging(value);
					this.SendPropertyChanging();
					this._sections = value;
					this.SendPropertyChanged("sections");
					this.OnsectionsChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_guests", DbType="NVarChar(100)")]
		public string guests
		{
			get
			{
				return this._guests;
			}
			set
			{
				if ((this._guests != value))
				{
					this.OnguestsChanging(value);
					this.SendPropertyChanging();
					this._guests = value;
					this.SendPropertyChanged("guests");
					this.OnguestsChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_options", DbType="NVarChar(50)")]
		public string options
		{
			get
			{
				return this._options;
			}
			set
			{
				if ((this._options != value))
				{
					this.OnoptionsChanging(value);
					this.SendPropertyChanging();
					this._options = value;
					this.SendPropertyChanged("options");
					this.OnoptionsChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_term", DbType="SmallDateTime NOT NULL")]
		public System.DateTime term
		{
			get
			{
				return this._term;
			}
			set
			{
				if ((this._term != value))
				{
					this.OntermChanging(value);
					this.SendPropertyChanging();
					this._term = value;
					this.SendPropertyChanged("term");
					this.OntermChanged();
				}
			}
		}
		
		public event PropertyChangingEventHandler PropertyChanging;
		
		public event PropertyChangedEventHandler PropertyChanged;
		
		protected virtual void SendPropertyChanging()
		{
			if ((this.PropertyChanging != null))
			{
				this.PropertyChanging(this, emptyChangingEventArgs);
			}
		}
		
		protected virtual void SendPropertyChanged(String propertyName)
		{
			if ((this.PropertyChanged != null))
			{
				this.PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
			}
		}
	}
	
	[global::System.Data.Linq.Mapping.TableAttribute(Name="dbo.Volitions")]
	public partial class Volitions : INotifyPropertyChanging, INotifyPropertyChanged
	{
		
		private static PropertyChangingEventArgs emptyChangingEventArgs = new PropertyChangingEventArgs(String.Empty);
		
		private int _PartitionId;
		
		private string _GuestId;
		
		private string _Selected;
		
		private System.DateTime _Updated;
		
    #region 拡張メソッドの定義
    partial void OnLoaded();
    partial void OnValidate(System.Data.Linq.ChangeAction action);
    partial void OnCreated();
    partial void OnPartitionIdChanging(int value);
    partial void OnPartitionIdChanged();
    partial void OnGuestIdChanging(string value);
    partial void OnGuestIdChanged();
    partial void OnSelectedChanging(string value);
    partial void OnSelectedChanged();
    partial void OnUpdatedChanging(System.DateTime value);
    partial void OnUpdatedChanged();
    #endregion
		
		public Volitions()
		{
			OnCreated();
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_PartitionId", DbType="Int NOT NULL", IsPrimaryKey=true)]
		public int PartitionId
		{
			get
			{
				return this._PartitionId;
			}
			set
			{
				if ((this._PartitionId != value))
				{
					this.OnPartitionIdChanging(value);
					this.SendPropertyChanging();
					this._PartitionId = value;
					this.SendPropertyChanged("PartitionId");
					this.OnPartitionIdChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_GuestId", DbType="NVarChar(16) NOT NULL", CanBeNull=false, IsPrimaryKey=true)]
		public string GuestId
		{
			get
			{
				return this._GuestId;
			}
			set
			{
				if ((this._GuestId != value))
				{
					this.OnGuestIdChanging(value);
					this.SendPropertyChanging();
					this._GuestId = value;
					this.SendPropertyChanged("GuestId");
					this.OnGuestIdChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_Selected", DbType="NVarChar(50)")]
		public string Selected
		{
			get
			{
				return this._Selected;
			}
			set
			{
				if ((this._Selected != value))
				{
					this.OnSelectedChanging(value);
					this.SendPropertyChanging();
					this._Selected = value;
					this.SendPropertyChanged("Selected");
					this.OnSelectedChanged();
				}
			}
		}
		
		[global::System.Data.Linq.Mapping.ColumnAttribute(Storage="_Updated", DbType="SmallDateTime NOT NULL")]
		public System.DateTime Updated
		{
			get
			{
				return this._Updated;
			}
			set
			{
				if ((this._Updated != value))
				{
					this.OnUpdatedChanging(value);
					this.SendPropertyChanging();
					this._Updated = value;
					this.SendPropertyChanged("Updated");
					this.OnUpdatedChanged();
				}
			}
		}
		
		public event PropertyChangingEventHandler PropertyChanging;
		
		public event PropertyChangedEventHandler PropertyChanged;
		
		protected virtual void SendPropertyChanging()
		{
			if ((this.PropertyChanging != null))
			{
				this.PropertyChanging(this, emptyChangingEventArgs);
			}
		}
		
		protected virtual void SendPropertyChanged(String propertyName)
		{
			if ((this.PropertyChanged != null))
			{
				this.PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
			}
		}
	}
}
#pragma warning restore 1591
