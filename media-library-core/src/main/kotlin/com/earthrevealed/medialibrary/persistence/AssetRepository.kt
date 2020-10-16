package com.earthrevealed.medialibrary.persistence

import com.earthrevealed.medialibrary.domain.Asset
import com.earthrevealed.medialibrary.domain.AssetId
import com.earthrevealed.medialibrary.domain.CollectionId
import com.earthrevealed.medialibrary.domain.TagId
import com.earthrevealed.medialibrary.persistence.exposed.AssetTable
import com.earthrevealed.medialibrary.persistence.exposed.AssetTagTable
import com.earthrevealed.medialibrary.persistence.exposed.from
import com.earthrevealed.medialibrary.persistence.exposed.toAsset
import com.earthrevealed.medialibrary.persistence.exposed.toEntityId
import com.earthrevealed.medialibrary.persistence.exposed.toTagId
import org.jetbrains.exposed.sql.andWhere
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Repository
@Transactional
class AssetRepository {
    fun save(asset: Asset) {
        AssetTable
                .insert { it.from(asset) }

        updateTagsFor(asset)
    }

    fun updateTagsFor(asset: Asset) {
        AssetTagTable.deleteWhere { AssetTagTable.assetId eq asset.id.value }

        asset.tagIds.forEach { tagId ->
            AssetTagTable
                    .insert {
                        it[this.assetId] = asset.id.value
                        it[this.tagId] = tagId.value
                    }
        }
    }

    fun all(collectionId: CollectionId) =
            AssetTable
                    .select { AssetTable.collectionId eq collectionId.value }
                    .map { assetRecord ->
                        assetRecord.toAsset {
                            tagIdsForAsset(assetRecord[AssetTable.id].value)
                        }
                    }

    fun get(collectionId: CollectionId, id: AssetId): Asset? =
            AssetTable
                    .select { AssetTable.id eq id.toEntityId() }
                    .andWhere { AssetTable.collectionId eq collectionId.value }
                    .firstOrNull()?.let {
                        it.toAsset {
                            tagIdsForAsset(it[AssetTable.id].value)
                        }
                    }

    fun hasAssets(collectionId: CollectionId): Boolean =
            AssetTable
                    .select { AssetTable.collectionId eq collectionId.value }
                    .limit(1)
                    .toSet()
                    .isNotEmpty()

    private fun tagIdsForAsset(assetId: UUID): List<TagId> = AssetTagTable
            .select { AssetTagTable.assetId eq assetId }
            .map { assetTagRecord -> assetTagRecord.toTagId() }

}