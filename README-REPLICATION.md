# Database Replication Setup

## Overview

This application now supports MongoDB replica set with read/write separation for improved performance and scalability.

## Configuration

### Connection String Format

Update your `.env` file with replica set connection string:

```
MONGODB_URI=mongodb://host1:27017,host2:27017,host3:27017/dbname?replicaSet=myReplicaSet
```

### Read/Write Separation

- **Write Operations**: Use Primary connection (guaranteed consistency)
- **Read Operations**: Use Secondary Preferred (better performance)

## Usage

### Import Database Helpers

```javascript
import { dbRead, dbWrite, paginatedFind } from '../utils/dbHelper.js';
```

### Write Operations (Primary)

```javascript
// Create
const user = await dbWrite.create(User, userData);

// Update
const updatedUser = await dbWrite.updateById(User, userId, updateData);

// Delete
const deletedUser = await dbWrite.deleteById(User, userId);
```

### Read Operations (Secondary Preferred)

```javascript
// Find by ID
const user = await dbRead.findById(User, userId);

// Find with query
const users = await dbRead.find(User, { role: 'admin' });

// Paginated results
const result = await paginatedFind(User, {}, { page: 1, limit: 10 });
```

## Benefits

- **Performance**: Read operations distributed across secondary nodes
- **Scalability**: Add more secondary nodes for increased read capacity
- **High Availability**: Automatic failover if primary goes down
- **Consistency**: Write operations always go to primary

## Monitoring

- Monitor replication lag between primary and secondary
- Set up alerts for replica set health
- Track connection pool utilization

## Production Setup

1. Configure MongoDB replica set with at least 3 nodes
2. Update connection string with all replica set members
3. Monitor replication lag and performance metrics
4. Consider adding more secondary nodes for read scaling
