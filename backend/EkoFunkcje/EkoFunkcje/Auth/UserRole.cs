using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.WindowsAzure.Storage.Table;

namespace EkoFunkcje.Auth
{
    public class UserRole : TableEntity
    {
        public UserRole()
        {
        }

        public UserRole(string userId, Role role)
        {
            PartitionKey = userId;
            RowKey = role.ToString();
        }

        public string UserId => PartitionKey;
        public Role Role => Enum.Parse<Role>(RowKey);
    }
}
