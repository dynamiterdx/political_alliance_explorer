-- CreateTable
CREATE TABLE "WorldState" (
    "id" TEXT NOT NULL,
    "revision_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_scan_time" TIMESTAMP(3),
    "freshness_status" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,

    CONSTRAINT "WorldState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Situation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "summary" TEXT,
    "causes" TEXT,
    "trajectory" TEXT,
    "intensity_score" INTEGER NOT NULL,
    "trend_direction" TEXT NOT NULL,
    "confidence_level" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "first_detected" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Situation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "sourceReference" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relevanceNote" TEXT,
    "situationId" TEXT NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alliance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "established_year" INTEGER,
    "purpose" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "Alliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "actor_type" TEXT NOT NULL,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region_type" TEXT NOT NULL,
    "geometry_reference" TEXT,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorldStateSituations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorldStateSituations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_WorldStateAlliances" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorldStateAlliances_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_WorldStateActors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorldStateActors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SituationActors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SituationActors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AllianceMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AllianceMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ActorRegions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActorRegions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_WorldStateRegions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorldStateRegions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SituationRegions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SituationRegions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorldState_revision_id_key" ON "WorldState"("revision_id");

-- CreateIndex
CREATE INDEX "_WorldStateSituations_B_index" ON "_WorldStateSituations"("B");

-- CreateIndex
CREATE INDEX "_WorldStateAlliances_B_index" ON "_WorldStateAlliances"("B");

-- CreateIndex
CREATE INDEX "_WorldStateActors_B_index" ON "_WorldStateActors"("B");

-- CreateIndex
CREATE INDEX "_SituationActors_B_index" ON "_SituationActors"("B");

-- CreateIndex
CREATE INDEX "_AllianceMembers_B_index" ON "_AllianceMembers"("B");

-- CreateIndex
CREATE INDEX "_ActorRegions_B_index" ON "_ActorRegions"("B");

-- CreateIndex
CREATE INDEX "_WorldStateRegions_B_index" ON "_WorldStateRegions"("B");

-- CreateIndex
CREATE INDEX "_SituationRegions_B_index" ON "_SituationRegions"("B");

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_situationId_fkey" FOREIGN KEY ("situationId") REFERENCES "Situation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorldStateSituations" ADD CONSTRAINT "_WorldStateSituations_A_fkey" FOREIGN KEY ("A") REFERENCES "Situation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorldStateSituations" ADD CONSTRAINT "_WorldStateSituations_B_fkey" FOREIGN KEY ("B") REFERENCES "WorldState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorldStateAlliances" ADD CONSTRAINT "_WorldStateAlliances_A_fkey" FOREIGN KEY ("A") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorldStateAlliances" ADD CONSTRAINT "_WorldStateAlliances_B_fkey" FOREIGN KEY ("B") REFERENCES "WorldState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorldStateActors" ADD CONSTRAINT "_WorldStateActors_A_fkey" FOREIGN KEY ("A") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorldStateActors" ADD CONSTRAINT "_WorldStateActors_B_fkey" FOREIGN KEY ("B") REFERENCES "WorldState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SituationActors" ADD CONSTRAINT "_SituationActors_A_fkey" FOREIGN KEY ("A") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SituationActors" ADD CONSTRAINT "_SituationActors_B_fkey" FOREIGN KEY ("B") REFERENCES "Situation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllianceMembers" ADD CONSTRAINT "_AllianceMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllianceMembers" ADD CONSTRAINT "_AllianceMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "Alliance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActorRegions" ADD CONSTRAINT "_ActorRegions_A_fkey" FOREIGN KEY ("A") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActorRegions" ADD CONSTRAINT "_ActorRegions_B_fkey" FOREIGN KEY ("B") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorldStateRegions" ADD CONSTRAINT "_WorldStateRegions_A_fkey" FOREIGN KEY ("A") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorldStateRegions" ADD CONSTRAINT "_WorldStateRegions_B_fkey" FOREIGN KEY ("B") REFERENCES "WorldState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SituationRegions" ADD CONSTRAINT "_SituationRegions_A_fkey" FOREIGN KEY ("A") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SituationRegions" ADD CONSTRAINT "_SituationRegions_B_fkey" FOREIGN KEY ("B") REFERENCES "Situation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
