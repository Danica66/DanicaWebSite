-- ============================================================
-- 迁移：修复 articles 表结构，对齐当前代码（不删数据、可重复执行）
--
-- 背景：旧库的 articles 表有 author_id、无 tag；当前代码的列表/写入
--       SQL 引用了 tag 且不再写 author_id，导致读接口 1054、写接口 1364。
--
-- 线上执行（部署目录，容器运行中）：
--   docker exec -i danica-db mysql -uroot -p<密码> <库名> < sql/migrations/001_fix_articles_schema.sql
--   注意：必须带上库名参数，脚本用 DATABASE() 作为 information_schema 的过滤条件。
-- ============================================================

-- 1) 补 tag 列（缺列时才加）
SET @has_tag := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'articles' AND COLUMN_NAME = 'tag'
);
SET @sql := IF(@has_tag = 0,
  'ALTER TABLE articles ADD COLUMN tag VARCHAR(255) NOT NULL DEFAULT '''' AFTER status',
  'DO 0');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- 2) 清理历史 author_id 列（当前代码已不再读写它）
--    顺序：先删外键 → 再删索引 → 最后删列；每一步都先判断是否存在

-- 2.1 删除指向 author_id 的外键（外键名以实际为准，动态查）
SET @fk_name := (
  SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'articles'
    AND COLUMN_NAME = 'author_id' AND REFERENCED_TABLE_NAME IS NOT NULL
  LIMIT 1
);
SET @sql := IF(@fk_name IS NOT NULL,
  CONCAT('ALTER TABLE articles DROP FOREIGN KEY `', @fk_name, '`'),
  'DO 0');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- 2.2 删除 author_id 上的普通索引（PRIMARY 除外）
SET @idx_name := (
  SELECT INDEX_NAME FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'articles'
    AND COLUMN_NAME = 'author_id' AND INDEX_NAME <> 'PRIMARY'
  LIMIT 1
);
SET @sql := IF(@idx_name IS NOT NULL,
  CONCAT('ALTER TABLE articles DROP INDEX `', @idx_name, '`'),
  'DO 0');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- 2.3 删除 author_id 列
SET @has_author := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'articles' AND COLUMN_NAME = 'author_id'
);
SET @sql := IF(@has_author > 0,
  'ALTER TABLE articles DROP COLUMN author_id',
  'DO 0');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- 3) 校验结果
SELECT '=== articles 表结构 ===' AS info;
SHOW COLUMNS FROM articles;
